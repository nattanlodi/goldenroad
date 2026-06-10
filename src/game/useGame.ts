import { useCallback, useEffect, useReducer, useRef } from "react";
import type { LineupPlayer, Role, Team } from "../types";
import { ROLES, TEAMS } from "../data/teams";
import { buildJourney, drawAny, lineScore, lineupPicks, rnd, seriesTarget, yy } from "./helpers";
import { initialState, reducer } from "./reducer";
import { useAudio } from "./useAudio";

const RECORD_KEY = "w60_record";

/**
 * Controlador do jogo: amarra o reducer (estado puro) com os timers da roleta /
 * das séries, o áudio sintetizado e a persistência. Espelha a `class Component`
 * do protótipo (rollSeq, pick, rerollOther/Same, playSeries, nextSeries, share…).
 */
export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audio = useAudio();
  const { sndTick, sndPick, sndWin, sndTrophy } = audio;

  // espelho do estado p/ ler valores atuais dentro de callbacks/timers
  const stateRef = useRef(state);
  stateRef.current = state;

  const rollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const seriesTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastId = useRef<string | undefined>(undefined);

  useEffect(
    () => () => {
      clearTimeout(rollTimer.current);
      clearInterval(seriesTimer.current);
      clearTimeout(copyTimer.current);
    },
    [],
  );

  const begin = useCallback(() => {
    clearTimeout(rollTimer.current);
    lastId.current = undefined;
    dispatch({ type: "begin" });
  }, []);

  const pickClassico = useCallback(() => dispatch({ type: "setDifficulty", difficulty: "classico" }), []);
  const pickEspecialista = useCallback(() => dispatch({ type: "setDifficulty", difficulty: "especialista" }), []);

  // ---- roleta de sorteio ----
  const rollSeq = useCallback(
    (finalTeam: Team) => {
      clearTimeout(rollTimer.current);
      dispatch({ type: "roll", display: rnd(TEAMS) });
      let i = 0;
      const total = 15;
      const step = () => {
        i++;
        if (i >= total) {
          sndPick();
          dispatch({ type: "rollEnd", team: finalTeam });
          return;
        }
        sndTick();
        dispatch({ type: "roll", display: rnd(TEAMS) });
        const delay = 45 + Math.pow(i / total, 2.5) * 230;
        rollTimer.current = setTimeout(step, delay);
      };
      rollTimer.current = setTimeout(step, 60);
    },
    [sndPick, sndTick],
  );

  const rollStart = useCallback(() => {
    if (stateRef.current.rolling) return;
    rollSeq(drawAny(lastId.current));
  }, [rollSeq]);

  // ---- escolha de jogador ----
  const pick = useCallback(
    (role: Role) => {
      const { current, lineup, rolling } = stateRef.current;
      if (rolling || !current || lineup[role]) return;
      const entry = current.players.find((x) => x[0] === role);
      if (!entry) return;
      sndPick();
      const player: LineupPlayer = {
        role,
        name: entry[1],
        rating: entry[2],
        team: current.team,
        short: current.short,
        year: current.year,
        league: current.league,
        champion: current.champion,
      };
      const lu = { ...lineup, [role]: player };
      const complete = ROLES.every((r) => lu[r]);
      if (!complete) lastId.current = current.id;
      dispatch({ type: "pick", role, player, complete });
    },
    [sndPick],
  );

  // ---- resorteios ----
  const rerollOther = useCallback(() => {
    const { rerolls, current, rolling } = stateRef.current;
    if (rolling || rerolls <= 0 || !current) return;
    const pool = TEAMS.filter((t) => t.team !== current.team);
    const target = rnd(pool.length ? pool : TEAMS);
    dispatch({ type: "rerollDec" });
    rollSeq(target);
  }, [rollSeq]);

  const rerollSame = useCallback(() => {
    const { rerolls, current, rolling } = stateRef.current;
    if (rolling || rerolls <= 0 || !current) return;
    const pool = TEAMS.filter((t) => t.team === current.team && t.id !== current.id);
    if (!pool.length) return;
    dispatch({ type: "rerollDec" });
    rollSeq(rnd(pool));
  }, [rollSeq]);

  // ---- playoffs ----
  const startSeries = useCallback(() => {
    dispatch({ type: "startSeries", journey: buildJourney() });
  }, []);

  const playSeries = useCallback(() => {
    const S = stateRef.current;
    if (S.seriesPlaying || S.revealed || !S.journey) return;
    const target = seriesTarget(S.journey[S.seriesIndex].score);
    dispatch({ type: "seriesPlayBegin" });
    let g = 0;
    clearInterval(seriesTimer.current);
    seriesTimer.current = setInterval(() => {
      g++;
      sndWin();
      dispatch({ type: "seriesGameWon", gamesWon: g });
      if (g >= target) {
        clearInterval(seriesTimer.current);
        setTimeout(() => dispatch({ type: "seriesReveal" }), 520);
      }
    }, 620);
  }, [sndWin]);

  const nextSeries = useCallback(() => {
    const S = stateRef.current;
    if (S.seriesIndex >= 5) {
      const avg = lineScore(S.lineup);
      let best = 0;
      try {
        best = parseInt(localStorage.getItem(RECORD_KEY) || "0", 10) || 0;
      } catch {
        /* ignore */
      }
      const isNewRecord = avg > best;
      const record = Math.max(avg, best);
      if (isNewRecord) {
        try {
          localStorage.setItem(RECORD_KEY, String(avg));
        } catch {
          /* ignore */
        }
      }
      sndTrophy();
      dispatch({ type: "toResult", record, isNewRecord });
    } else {
      dispatch({ type: "nextSeries" });
    }
  }, [sndTrophy]);

  const restart = useCallback(() => dispatch({ type: "restart" }), []);

  // ---- compartilhar ----
  const copyResult = useCallback(() => {
    const S = stateRef.current;
    const picks = lineupPicks(S.lineup);
    const avg = lineScore(S.lineup);
    const line = picks
      .map((p) => `${p.role === "BOT" ? "ADC" : p.role} ${p.name} (${p.short} '${yy(p.year)})`)
      .join(" · ");
    const txt = `🏆 6X0 Worlds — fiz um 6-0 PERFEITO!\n${line}\nNota da line: ${avg}. Consegue superar?`;
    const done = () => {
      dispatch({ type: "setCopied", copied: true });
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => dispatch({ type: "setCopied", copied: false }), 1800);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(done, done);
    else done();
  }, []);

  const downloadCard = useCallback(() => {
    const S = stateRef.current;
    const picks = lineupPicks(S.lineup);
    const avg = lineScore(S.lineup);
    const champs = picks.filter((p) => p.champion).length;
    const W = 1080;
    const H = 1080;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d");
    if (!x) return;
    const bg = x.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1b2128");
    bg.addColorStop(1, "#0e1116");
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(201,162,75,0.5)";
    x.lineWidth = 4;
    x.strokeRect(40, 40, W - 80, H - 80);
    x.textAlign = "center";
    x.fillStyle = "#E8CE86";
    x.font = "700 150px 'Bebas Neue', sans-serif";
    x.fillText("6", W / 2 - 150, 252);
    x.fillText("0", W / 2 + 150, 252);
    x.lineCap = "round";
    x.lineWidth = 18;
    x.strokeStyle = "#6aa0da";
    x.beginPath();
    x.moveTo(W / 2 - 46, 150);
    x.lineTo(W / 2 + 46, 250);
    x.stroke();
    x.strokeStyle = "#D2AC52";
    x.beginPath();
    x.moveTo(W / 2 - 46, 250);
    x.lineTo(W / 2 + 46, 150);
    x.stroke();
    x.fillStyle = "#9097A1";
    x.font = "400 28px 'Space Mono', monospace";
    x.fillText("CAMPEÃO DO MUNDO · 6–0 PERFEITO", W / 2, 332);
    x.fillStyle = "#E8CE86";
    x.font = "700 124px 'Space Mono', monospace";
    x.fillText(String(avg), W / 2, 476);
    x.fillStyle = "#9097A1";
    x.font = "400 24px 'Space Mono', monospace";
    x.fillText("NOTA DA LINE  ·  " + champs + "/5 CAMPEÕES MUNDIAIS", W / 2, 514);
    let y = 600;
    picks.forEach((p) => {
      x.fillStyle = "rgba(201,162,75,0.1)";
      x.fillRect(150, y - 40, W - 300, 66);
      x.textAlign = "left";
      x.fillStyle = "#E8CE86";
      x.font = "700 26px 'Space Mono', monospace";
      x.fillText(p.role === "BOT" ? "ADC" : p.role, 178, y + 5);
      x.fillStyle = "#F2ECDE";
      x.font = "600 40px 'Oswald', sans-serif";
      x.fillText(p.name, 300, y + 8);
      x.textAlign = "right";
      x.fillStyle = "#9097A1";
      x.font = "400 24px 'Space Mono', monospace";
      x.fillText(p.short + " '" + yy(p.year), W - 178, y + 4);
      y += 84;
    });
    x.textAlign = "center";
    x.fillStyle = "#777E89";
    x.font = "400 24px 'Space Mono', monospace";
    x.fillText("FLAWLESS WORLDS RUN", W / 2, H - 72);
    try {
      const a = document.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "6x0-worlds.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      /* ignore */
    }
  }, []);

  return {
    state,
    muted: audio.muted,
    toggleMute: audio.toggleMute,
    begin,
    pickClassico,
    pickEspecialista,
    rollStart,
    pick,
    rerollOther,
    rerollSame,
    startSeries,
    playSeries,
    nextSeries,
    restart,
    copyResult,
    downloadCard,
  };
}

export type Game = ReturnType<typeof useGame>;

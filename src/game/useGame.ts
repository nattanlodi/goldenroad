import { useCallback, useEffect, useReducer, useRef } from "react";
import type { LineupPlayer, PlayedSeries, Role, Team } from "../types";
import { DRAFT_TEAMS, ROLES } from "../data/teams";
import { buildNextSeries, drawAny, lineScore, lineupPicks, rarityFor, rnd, rollSeriesHighlights, simulateSeries, tierFor, weightedTeam, yy } from "./helpers";
import { initialState, reducer } from "./reducer";
import { useAudio } from "./useAudio";

const RECORD_KEY = "w60_record";

/** Converte "#rrggbb" + alpha em "rgba(r,g,b,a)" (pro canvas do card). */
function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function loadRecord(): number {
  try {
    return parseInt(localStorage.getItem(RECORD_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

/**
 * Controlador do jogo: amarra o reducer com os timers da roleta / das séries,
 * o áudio sintetizado, a persistência e o motor de competição (Suíça + mata-mata).
 */
export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audio = useAudio();
  const { sndTick, sndPick, sndReveal, sndWin, sndLose, sndTrophy, sndDefeat, sndPenta, sndMvp } = audio;

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
      dispatch({ type: "roll", display: rnd(DRAFT_TEAMS) });
      let i = 0;
      const total = 15;
      const step = () => {
        i++;
        if (i >= total) {
          sndReveal();
          dispatch({ type: "rollEnd", team: finalTeam });
          return;
        }
        sndTick();
        dispatch({ type: "roll", display: rnd(DRAFT_TEAMS) });
        const delay = 45 + Math.pow(i / total, 2.5) * 230;
        rollTimer.current = setTimeout(step, delay);
      };
      rollTimer.current = setTimeout(step, 60);
    },
    [sndReveal, sndTick],
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
        finalist: current.finalist,
        country: entry[3],
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
    const pool = DRAFT_TEAMS.filter((t) => t.team !== current.team);
    const target = weightedTeam(pool.length ? pool : DRAFT_TEAMS);
    dispatch({ type: "rerollDec" });
    rollSeq(target);
  }, [rollSeq]);

  const rerollSame = useCallback(() => {
    const { rerolls, current, rolling } = stateRef.current;
    if (rolling || rerolls <= 0 || !current) return;
    const pool = DRAFT_TEAMS.filter((t) => t.team === current.team && t.id !== current.id);
    if (!pool.length) return;
    dispatch({ type: "rerollDec" });
    rollSeq(rnd(pool));
  }, [rollSeq]);

  // ---- campanha / playoffs ----
  const startSeries = useCallback(() => {
    const { series, usedOppIds } = buildNextSeries("swiss", 0, 0, 0, []);
    dispatch({ type: "startCampaign", series, usedOppIds });
  }, []);

  const playSeries = useCallback(() => {
    const S = stateRef.current;
    if (S.seriesPlaying || S.revealed || !S.series) return;
    const series = S.series;
    const seriesIndex = S.history.length;
    // rodada da suíça = quantas séries suíças já houve + 1 (só relevante na suíça)
    const swissRound =
      series.stageKey === "swiss" ? S.history.filter((h) => h.stageKey === "swiss").length + 1 : undefined;
    const yourAvg = lineScore(S.lineup);
    const sim = simulateSeries(series.target, yourAvg, series.opp.avg);
    const highlight = rollSeriesHighlights(sim.games, lineupPicks(S.lineup), series.opp.players, sim.won);
    dispatch({ type: "playBegin" });
    let yw = 0;
    let ow = 0;
    let i = 0;
    clearInterval(seriesTimer.current);
    seriesTimer.current = setInterval(() => {
      const youWon = sim.games[i];
      const gameNumber = i + 1;
      i++;
      if (youWon) {
        yw++;
        sndWin();
      } else {
        ow++;
        sndLose();
      }
      // pentakill ocorrido NESTE jogo? (seu tem prioridade pro flash/som épico)
      const pentasNow = highlight.pentakills.filter((k) => k.gameNumber === gameNumber);
      const penta = pentasNow.find((k) => k.side === "you") ?? pentasNow[0] ?? null;
      const gameMvp = highlight.gameMvps.find((m) => m.gameNumber === gameNumber) ?? null;
      if (penta) sndPenta();
      const liveGame = {
        gameNumber,
        youWon,
        mvp: gameMvp,
        pentakills: pentasNow,
        stageLabel: series.stageLabel,
        seriesIndex,
        format: series.format,
        oppShort: series.opp.short,
        oppYear: series.opp.year,
        swissRound,
      };
      dispatch({ type: "gameStep", yourGames: yw, oppGames: ow, penta, gameMvp, liveGame });
      if (i >= sim.games.length) {
        clearInterval(seriesTimer.current);
        setTimeout(() => {
          if (highlight.mvp) sndMvp();
          dispatch({ type: "seriesReveal", result: sim.won ? "win" : "loss", highlight });
        }, 700);
      }
    }, 1000);
  }, [sndWin, sndLose, sndPenta, sndMvp]);

  const nextSeries = useCallback(() => {
    const S = stateRef.current;
    if (!S.series || !S.revealed) return;
    const won = S.seriesResult === "win";
    const played: PlayedSeries = {
      stageKey: S.series.stageKey,
      stageLabel: S.series.stageLabel,
      format: S.series.format,
      opp: S.series.opp,
      yourGames: S.yourGames,
      oppGames: S.oppGames,
      won,
    };

    const finishChampion = () => {
      const avg = lineScore(S.lineup);
      const best = loadRecord();
      const isNewRecord = avg > best;
      if (isNewRecord) {
        try {
          localStorage.setItem(RECORD_KEY, String(avg));
        } catch {
          /* ignore */
        }
      }
      sndTrophy();
      // MVP das Finais = MVP da série final (seu, pois você venceu a final).
      const finalsMvp = S.highlight?.mvp ?? null;
      dispatch({ type: "finishCampaign", played, finished: "champion", record: Math.max(avg, best), isNewRecord, finalsMvp });
    };
    const finishEliminated = () => {
      sndDefeat();
      dispatch({ type: "finishCampaign", played, finished: "eliminated", record: loadRecord(), isNewRecord: false, finalsMvp: null });
    };

    if (S.stagePhase === "swiss") {
      if (won) {
        const swissWins = S.swissWins + 1;
        if (swissWins >= 3) {
          const { series, usedOppIds } = buildNextSeries("ko", swissWins, S.swissLosses, 0, S.usedOppIds);
          dispatch({
            type: "nextSeriesAdvance",
            played,
            series,
            stagePhase: "ko",
            swissWins,
            swissLosses: S.swissLosses,
            koIndex: 0,
            usedOppIds,
          });
        } else {
          const { series, usedOppIds } = buildNextSeries("swiss", swissWins, S.swissLosses, S.koIndex, S.usedOppIds);
          dispatch({
            type: "nextSeriesAdvance",
            played,
            series,
            stagePhase: "swiss",
            swissWins,
            swissLosses: S.swissLosses,
            koIndex: S.koIndex,
            usedOppIds,
          });
        }
      } else {
        const swissLosses = S.swissLosses + 1;
        if (swissLosses >= 3) {
          finishEliminated();
        } else {
          const { series, usedOppIds } = buildNextSeries("swiss", S.swissWins, swissLosses, S.koIndex, S.usedOppIds);
          dispatch({
            type: "nextSeriesAdvance",
            played,
            series,
            stagePhase: "swiss",
            swissWins: S.swissWins,
            swissLosses,
            koIndex: S.koIndex,
            usedOppIds,
          });
        }
      }
    } else {
      // mata-mata: vitória avança; derrota elimina
      if (won) {
        if (S.koIndex >= 2) {
          finishChampion();
        } else {
          const koIndex = S.koIndex + 1;
          const { series, usedOppIds } = buildNextSeries("ko", S.swissWins, S.swissLosses, koIndex, S.usedOppIds);
          dispatch({
            type: "nextSeriesAdvance",
            played,
            series,
            stagePhase: "ko",
            swissWins: S.swissWins,
            swissLosses: S.swissLosses,
            koIndex,
            usedOppIds,
          });
        }
      } else {
        finishEliminated();
      }
    }
  }, [sndTrophy, sndDefeat]);

  const clearFlashes = useCallback(() => dispatch({ type: "clearFlashes" }), []);

  const restart = useCallback(() => dispatch({ type: "restart" }), []);

  // ---- compartilhar ----
  const copyResult = useCallback(() => {
    const S = stateRef.current;
    const picks = lineupPicks(S.lineup);
    const avg = lineScore(S.lineup);
    const line = picks
      .map((p) => `${p.role === "BOT" ? "ADC" : p.role} ${p.name} (${p.short} '${yy(p.year)})`)
      .join(" · ");
    const wins = S.history.filter((h) => h.won).length;
    const losses = S.history.filter((h) => !h.won).length;
    const header =
      S.finished === "champion"
        ? losses === 0
          ? "🏆 6X0 Worlds — 6-0 PERFEITO, campeão do mundo!"
          : `🏆 6X0 Worlds — CAMPEÃO DO MUNDO (${wins}-${losses})!`
        : `6X0 Worlds — minha campanha terminou em ${wins}-${losses}.`;
    const fmvp = S.finished === "champion" ? S.finalsMvp : null;
    const mvpLine = fmvp ? `\n🏆 MVP das Finais: ${fmvp.name} (${fmvp.role === "BOT" ? "ADC" : fmvp.role})` : "";
    const txt = `${header}\n${line}\nNota da line: ${avg}.${mvpLine} Consegue superar?`;
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
    const wins = S.history.filter((h) => h.won).length;
    const losses = S.history.filter((h) => !h.won).length;
    const isChampion = S.finished === "champion";
    const perfect = isChampion && losses === 0;
    const subtitle = isChampion
      ? perfect
        ? "CAMPEÃO DO MUNDO · 6–0 PERFEITO"
        : `CAMPEÃO DO MUNDO · ${wins}–${losses}`
      : `CAMPANHA ENCERRADA · ${wins}–${losses}`;
    const footer = perfect ? "FLAWLESS WORLDS RUN" : "MY WORLDS RUN";
    const tierLabel = picks.length ? tierFor(avg).tier : "";

    const W = 1080;
    const H = 1080;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d");
    if (!x) return;

    // helper: retângulo arredondado
    const rr = (rx: number, ry: number, rw: number, rh: number, rad: number) => {
      x.beginPath();
      x.moveTo(rx + rad, ry);
      x.arcTo(rx + rw, ry, rx + rw, ry + rh, rad);
      x.arcTo(rx + rw, ry + rh, rx, ry + rh, rad);
      x.arcTo(rx, ry + rh, rx, ry, rad);
      x.arcTo(rx, ry, rx + rw, ry, rad);
      x.closePath();
    };

    // ---- fundo (mesma vibe escura do app: grafite -> quase preto) ----
    const bg = x.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1b212a");
    bg.addColorStop(0.55, "#141922");
    bg.addColorStop(1, "#0d1015");
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    // aurora dourada suave no topo (como o AppBackground)
    const aura = x.createRadialGradient(W / 2, 150, 40, W / 2, 150, 620);
    aura.addColorStop(0, "rgba(201,162,75,0.16)");
    aura.addColorStop(1, "rgba(201,162,75,0)");
    x.fillStyle = aura;
    x.fillRect(0, 0, W, 520);

    // moldura dourada arredondada
    x.strokeStyle = "rgba(201,162,75,0.45)";
    x.lineWidth = 3;
    rr(38, 38, W - 76, H - 76, 36);
    x.stroke();

    x.textAlign = "center";

    // ---- logo 6×0 ----
    x.fillStyle = "#e8ce86";
    x.font = "700 120px 'Bebas Neue', sans-serif";
    x.fillText("6", W / 2 - 118, 214);
    x.fillText("0", W / 2 + 118, 214);
    x.lineCap = "round";
    x.lineWidth = 15;
    x.strokeStyle = "#6aa0da";
    x.beginPath();
    x.moveTo(W / 2 - 38, 128);
    x.lineTo(W / 2 + 38, 208);
    x.stroke();
    x.strokeStyle = "#c9a24b";
    x.beginPath();
    x.moveTo(W / 2 - 38, 208);
    x.lineTo(W / 2 + 38, 128);
    x.stroke();

    // subtítulo (status da campanha)
    x.fillStyle = isChampion ? "#e8ce86" : "#d2a08e";
    x.font = "700 25px 'Geist', sans-serif";
    x.fillText(subtitle.toUpperCase(), W / 2, 268);

    // ---- bloco da NOTA DA LINE (card destacado, estilo "Média do elenco") ----
    const nbY = 300;
    const nbW = 470;
    const nbX = (W - nbW) / 2;
    const nbGrad = x.createLinearGradient(nbX, nbY, nbX + nbW, nbY + 118);
    nbGrad.addColorStop(0, "rgba(58,48,22,0.55)");
    nbGrad.addColorStop(1, "rgba(30,37,49,0.7)");
    x.fillStyle = nbGrad;
    rr(nbX, nbY, nbW, 118, 22);
    x.fill();
    x.strokeStyle = "rgba(201,162,75,0.4)";
    x.lineWidth = 1.5;
    rr(nbX, nbY, nbW, 118, 22);
    x.stroke();
    // nota grande à esquerda + tier à direita
    x.textAlign = "left";
    x.fillStyle = "#e8ce86";
    x.font = "700 86px 'Geist', sans-serif";
    x.fillText(String(avg), nbX + 34, nbY + 86);
    x.fillStyle = "#9097a1";
    x.font = "400 17px 'Geist', sans-serif";
    x.fillText("NOTA DA LINE", nbX + 34, nbY + 26);
    x.textAlign = "right";
    x.fillStyle = "#f2ecde";
    x.font = "700 30px 'Geist', sans-serif";
    x.fillText(tierLabel, nbX + nbW - 30, nbY + 64);
    x.fillStyle = "#9097a1";
    x.font = "400 17px 'Geist', sans-serif";
    x.fillText(`${champs}/5 CAMPEÕES MUNDIAIS`, nbX + nbW - 30, nbY + 96);

    // ---- linhas dos jogadores (estilo dos cards de raridade do draft) ----
    const hasFmvp = isChampion && !!S.finalsMvp;
    const rowH = 78;
    const rowGap = 12;
    const rowX = 100;
    const rowW = W - 200;
    let y = 470;
    picks.forEach((p) => {
      const skin = rarityFor(p.rating);
      const rar = skin.ratingColor;
      // fundo da row: leve tinta da raridade sobre o painel escuro
      const rowGrad = x.createLinearGradient(rowX, y, rowX + rowW, y);
      rowGrad.addColorStop(0, "rgba(30,37,49,0.92)");
      rowGrad.addColorStop(1, "rgba(22,28,38,0.92)");
      x.fillStyle = rowGrad;
      rr(rowX, y, rowW, rowH, 16);
      x.fill();
      // glow/borda na cor da raridade
      x.fillStyle = hexA(rar, 0.1);
      rr(rowX, y, rowW, rowH, 16);
      x.fill();
      x.strokeStyle = hexA(rar, 0.5);
      x.lineWidth = 1.5;
      rr(rowX, y, rowW, rowH, 16);
      x.stroke();
      // chip da lane (badge) à esquerda
      const chipR = 26;
      const chipCx = rowX + 44;
      const chipCy = y + rowH / 2;
      x.beginPath();
      x.arc(chipCx, chipCy, chipR, 0, Math.PI * 2);
      x.fillStyle = "rgba(201,162,75,0.14)";
      x.fill();
      x.strokeStyle = "rgba(201,162,75,0.4)";
      x.lineWidth = 1.5;
      x.stroke();
      x.textAlign = "center";
      x.fillStyle = "#e8ce86";
      x.font = "700 18px 'Geist', sans-serif";
      x.fillText(p.role === "BOT" ? "ADC" : p.role, chipCx, chipCy + 6);
      // nome + time/ano
      x.textAlign = "left";
      x.fillStyle = "#f2ecde";
      x.font = "600 38px 'Oswald', sans-serif";
      x.fillText(p.name, rowX + 90, y + 42);
      x.fillStyle = "#8b919b";
      x.font = "400 19px 'Geist', sans-serif";
      x.fillText(`${p.short} '${yy(p.year)}${p.champion ? "  ★" : ""}`, rowX + 92, y + 64);
      // overall grande na cor da raridade, à direita
      x.textAlign = "right";
      x.fillStyle = rar;
      x.font = "700 50px 'Geist', sans-serif";
      x.fillText(String(p.rating), rowX + rowW - 28, y + rowH / 2 + 17);
      y += rowH + rowGap;
    });

    // ---- MVP das Finais (só campeão) — faixa dourada destacada ----
    const fmvp = hasFmvp ? S.finalsMvp : null;
    if (fmvp) {
      const mh = 64;
      const mGrad = x.createLinearGradient(rowX, y, rowX + rowW, y);
      mGrad.addColorStop(0, "rgba(201,162,75,0.28)");
      mGrad.addColorStop(1, "rgba(120,80,24,0.2)");
      x.fillStyle = mGrad;
      rr(rowX, y, rowW, mh, 16);
      x.fill();
      x.strokeStyle = "rgba(232,206,134,0.65)";
      x.lineWidth = 2;
      rr(rowX, y, rowW, mh, 16);
      x.stroke();
      x.textAlign = "left";
      x.fillStyle = "#e8ce86";
      x.font = "700 22px 'Geist', sans-serif";
      x.fillText("🏆 MVP DAS FINAIS", rowX + 28, y + mh / 2 + 8);
      x.textAlign = "right";
      x.fillStyle = "#f2ecde";
      x.font = "600 34px 'Oswald', sans-serif";
      x.fillText(`${fmvp.name} · ${fmvp.role === "BOT" ? "ADC" : fmvp.role}`, rowX + rowW - 28, y + mh / 2 + 11);
      y += mh + rowGap;
    }

    // ---- rodapé ----
    x.textAlign = "center";
    x.fillStyle = "#777e89";
    x.font = "400 22px 'Geist', sans-serif";
    x.fillText(footer + "  ·  6x0worlds", W / 2, H - 64);
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
    clearFlashes,
    restart,
    copyResult,
    downloadCard,
  };
}

export type Game = ReturnType<typeof useGame>;

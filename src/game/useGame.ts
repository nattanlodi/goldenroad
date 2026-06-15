import { useCallback, useEffect, useReducer, useRef } from "react";
import type {
  ActiveBuff,
  CardTarget,
  EventCard,
  GameMode,
  Lineup,
  LineupPlayer,
  PlayedSeries,
  Role,
  RosterEntry,
  SeriesMods,
  SeriesSetup,
  Team,
} from "../types";
import { DRAFT_TEAMS, ROLES } from "../data/teams";
import { buildNextSeries, drawAny, lineScore, lineupPicks, rarityFor, rnd, rollSeriesHighlights, simulateSeries, tierFor, weightedTeam, yy } from "./helpers";
import { computeForma, effLineScore, effOpp, effOppAvg, effYou, emptyMods } from "./effects";
import { rollEventCards } from "../data/eventCards";
import { buildMsiSeries, MSI_START, msiNext } from "./msi";
import { buildFsSeries, FS_START, fsNext } from "./firstStand";
import { initialState, reducer, type GameState, type PreSeries } from "./reducer";
import { computeRunScore } from "./score";
import { useAudio } from "./useAudio";

/** Calcula o pacote de pré-série (forma do dia + evento) ao entrar numa série. */
function makePre(prev: GameState, series: SeriesSetup, isFirst: boolean): PreSeries {
  if (isFirst) return { seriesMods: emptyMods(), formNotes: [], pendingEvent: null, pendingHostile: false, eventDry: 0 };
  const { mods, notes } = computeForma(prev.seriesResult, prev.highlight, prev.series?.format, prev.lineup);
  const hasFrozen = notes.some((n) => n.kind === "gelado");
  const roll = rollEventCards(prev.eventDry, hasFrozen, !!series.decisive, series.opp.avg);
  return { seriesMods: mods, formNotes: notes, pendingEvent: roll.cards, pendingHostile: roll.hostile, eventDry: roll.dry };
}

const clampRating = (n: number) => Math.max(40, Math.min(100, n));

const RECORD_KEY = "w60_record";
const SCORE_RECORD_KEY = "w60_score_record";

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

function loadScoreRecord(): number {
  try {
    return parseInt(localStorage.getItem(SCORE_RECORD_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

/** Conta os destaques SEUS da run (pra pontuação): pentakills e séries vencidas com MVP seu. */
function tallyHighlights(campaignGames: GameState["campaignGames"], history: GameState["history"]) {
  const pentakillsYou = campaignGames.reduce((a, g) => a + g.pentakills.filter((k) => k.side === "you").length, 0);
  // séries: agrupa os jogos por seriesIndex e, no bloco vencido por você, vê se o MVP da série foi seu.
  const bySeries = new Map<number, typeof campaignGames>();
  for (const g of campaignGames) {
    const idx = g.seriesIndex ?? 0;
    if (!bySeries.has(idx)) bySeries.set(idx, []);
    bySeries.get(idx)!.push(g);
  }
  let seriesMvpWins = 0;
  for (const games of bySeries.values()) {
    if (games.length < 2) continue; // Bo1 não tem MVP de série
    const yourW = games.filter((g) => g.youWon).length;
    if (yourW <= games.length - yourW) continue; // só séries que VOCÊ venceu
    // MVP da série = quem foi MVP de mais partidas do lado vencedor (igual ao SeriesScreen).
    const cand = games.map((g) => g.mvp).filter((m): m is NonNullable<typeof m> => !!m && m.side === "you");
    if (cand.length) seriesMvpWins++;
  }
  void history;
  return { pentakillsYou, seriesMvpWins };
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

  const begin = useCallback((mode: GameMode = "worlds") => {
    clearTimeout(rollTimer.current);
    lastId.current = undefined;
    dispatch({ type: "begin", mode });
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
        baseRating: entry[2],
        team: current.team,
        short: current.short,
        year: current.year,
        league: current.league,
        tournament: current.tournament ?? "worlds",
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
    const S = stateRef.current;
    // GOLDENROAD começa pelo FIRST STAND (1º torneio do ano), na Upper Semifinal.
    if (S.mode === "goldenroad") {
      const { series, usedOppIds } = buildFsSeries(FS_START, []);
      dispatch({ type: "startFirstStand", series, usedOppIds, node: FS_START, pre: makePre(S, series, true) });
      return;
    }
    const { series, usedOppIds } = buildNextSeries("swiss", 0, 0, 0, []);
    dispatch({ type: "startCampaign", series, usedOppIds, pre: makePre(S, series, true) });
  }, []);

  const playSeries = useCallback(() => {
    const S = stateRef.current;
    if (S.seriesPlaying || S.revealed || !S.series || S.pendingEvent) return;
    const series = S.series;
    const seriesIndex = S.history.length;
    // rodada da suíça = quantas séries suíças já houve + 1 (só relevante na suíça)
    const swissRound =
      series.stageKey === "swiss" ? S.history.filter((h) => h.stageKey === "swiss").length + 1 : undefined;
    // notas EFETIVAS (base + deltas temporários da forma/cartas) na simulação E nos destaques.
    const yourAvg = effLineScore(S.lineup, S.seriesMods);
    const oppAvg = effOppAvg(series.opp, S.seriesMods);
    const sim = simulateSeries(series.target, yourAvg, oppAvg);
    const youEff: LineupPlayer[] = lineupPicks(S.lineup).map((p) => ({ ...p, rating: effYou(S.lineup, S.seriesMods, p.role) }));
    const oppEff: RosterEntry[] = series.opp.players.map((p) => [p[0], p[1], effOpp(p[2], S.seriesMods, p[0]), p[3]]);
    const highlight = rollSeriesHighlights(sim.games, youEff, oppEff, sim.won);
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
      // marca o campeonato: no GOLDENROAD usa a etapa atual (msi/worlds); avulso é worlds.
      championship: S.mode === "goldenroad" ? S.careerStage : "worlds",
    };

    // pontuação de run: computa a partir da run inteira (history + played já entra).
    const computeScore = (finished: "champion" | "eliminated") => {
      const fullHistory = [...S.history, played];
      const { pentakillsYou, seriesMvpWins } = tallyHighlights(S.campaignGames, fullHistory);
      const run = computeRunScore({
        history: fullHistory,
        lineup: lineupPicks(S.lineup),
        pentakillsYou,
        seriesMvpWins,
        mode: S.mode,
        difficulty: S.difficulty,
        finished,
      });
      const bestScore = loadScoreRecord();
      const isNewScoreRecord = run.total > bestScore;
      if (isNewScoreRecord) {
        try {
          localStorage.setItem(SCORE_RECORD_KEY, String(run.total));
        } catch {
          /* ignore */
        }
      }
      return { runScore: run, scoreRecord: Math.max(run.total, bestScore), isNewScoreRecord };
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
      const sc = computeScore("champion");
      dispatch({ type: "finishCampaign", played, finished: "champion", record: Math.max(avg, best), isNewRecord, finalsMvp, ...sc });
    };
    const finishEliminated = () => {
      sndDefeat();
      const sc = computeScore("eliminated");
      dispatch({ type: "finishCampaign", played, finished: "eliminated", record: loadRecord(), isNewRecord: false, finalsMvp: null, ...sc });
    };

    // ---- FIRST STAND (modo GOLDENROAD): grupo (double-elim) + knockout ----
    if (S.mode === "goldenroad" && S.careerStage === "first_stand" && S.fsNode) {
      const outcome = fsNext(S.fsNode, won);
      if (outcome.kind === "champion") {
        // campeão do First Stand → segue pro MSI com a MESMA line (carreira continua).
        sndTrophy();
        const { series, usedOppIds } = buildMsiSeries(MSI_START, []);
        dispatch({ type: "fsToMsi", played, series, usedOppIds, node: MSI_START, pre: makePre(S, series, false) });
      } else if (outcome.kind === "eliminated") {
        finishEliminated();
      } else {
        const { series, usedOppIds } = buildFsSeries(outcome.node, S.usedOppIds);
        dispatch({ type: "fsAdvance", played, series, node: outcome.node, usedOppIds, pre: makePre(S, series, false) });
      }
      return;
    }

    // ---- MSI (modo GOLDENROAD): bracket double-elim ----
    if (S.mode === "goldenroad" && S.careerStage === "msi" && S.msiNode) {
      const outcome = msiNext(S.msiNode, won);
      if (outcome.kind === "champion") {
        // campeão do MSI → segue pro Worlds com a MESMA line (carreira continua).
        sndTrophy();
        const { series, usedOppIds } = buildNextSeries("swiss", 0, 0, 0, []);
        dispatch({ type: "msiToWorlds", played, series, usedOppIds, pre: makePre(S, series, false) });
      } else if (outcome.kind === "eliminated") {
        finishEliminated();
      } else {
        const { series, usedOppIds } = buildMsiSeries(outcome.node, S.usedOppIds);
        dispatch({ type: "msiAdvance", played, series, node: outcome.node, usedOppIds, pre: makePre(S, series, false) });
      }
      return;
    }

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
            pre: makePre(S, series, false),
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
            pre: makePre(S, series, false),
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
            pre: makePre(S, series, false),
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
            pre: makePre(S, series, false),
          });
        }
      } else {
        finishEliminated();
      }
    }
  }, [sndTrophy, sndDefeat]);

  // ---- resolução de carta de evento (pré-série) ----
  const resolveEventCard = useCallback((card: EventCard, target?: CardTarget) => {
    const S = stateRef.current;
    if (!S.series) return;
    let lineup: Lineup = S.lineup;
    let series = S.series;
    const mods: SeriesMods = { you: { ...S.seriesMods.you }, opp: { ...S.seriesMods.opp } };
    const perm: Partial<Record<Role, number>> = { ...S.permMods };
    let formNotes = S.formNotes;
    const buffs: ActiveBuff[] = [...S.activeBuffs];
    const picks = lineupPicks(lineup);

    const addYou = (role: Role, delta: number) => {
      mods.you[role] = (mods.you[role] ?? 0) + delta;
    };
    const addOpp = (role: Role, delta: number) => {
      mods.opp[role] = (mods.opp[role] ?? 0) + delta;
    };

    switch (card.kind) {
      case "teamBuff": {
        // permanente: sobe a nota base de toda a line + registra o delta por lane (selo +N).
        const lu: Lineup = { ...lineup };
        for (const r of ROLES) {
          const p = lu[r];
          if (p) {
            lu[r] = { ...p, rating: clampRating(p.rating + card.value) };
            perm[r] = (perm[r] ?? 0) + card.value;
          }
        }
        lineup = lu;
        buffs.push({ id: `team-${buffs.length}`, icon: card.icon, label: `+${card.value} na line` });
        break;
      }
      case "teamBuffTemp": {
        for (const p of picks) addYou(p.role, card.value);
        break;
      }
      case "roleBuffRandom": {
        if (picks.length) addYou(picks[Math.floor(Math.random() * picks.length)].role, card.value);
        break;
      }
      case "roleBuffChoose": {
        if (target?.role) addYou(target.role, card.value);
        break;
      }
      case "weakestBuff": {
        if (picks.length) {
          const weakest = picks.reduce((m, p) => (p.rating < m.rating ? p : m), picks[0]);
          addYou(weakest.role, card.value);
        }
        break;
      }
      case "weakestBuffPerm": {
        if (picks.length) {
          const weakest = picks.reduce((m, p) => (p.rating < m.rating ? p : m), picks[0]);
          lineup = { ...lineup, [weakest.role]: { ...weakest, rating: clampRating(weakest.rating + card.value) } };
          perm[weakest.role] = (perm[weakest.role] ?? 0) + card.value;
          buffs.push({ id: `prom-${buffs.length}`, icon: card.icon, label: `${weakest.name} +${card.value}` });
        }
        break;
      }
      case "oldestBuff": {
        if (picks.length) {
          const oldest = picks.reduce((m, p) => (p.year < m.year ? p : m), picks[0]);
          addYou(oldest.role, card.value);
        }
        break;
      }
      case "nerfOpp": {
        if (target?.role) mods.opp[target.role] = (mods.opp[target.role] ?? 0) - card.value;
        break;
      }
      case "nerfOppAll": {
        for (const p of series.opp.players) mods.opp[p[0]] = (mods.opp[p[0]] ?? 0) - card.value;
        break;
      }
      case "swapOwnRole": {
        const { role, pickTeamId, pickName } = target ?? {};
        if (!role || !pickTeamId || !pickName) return;
        const team = DRAFT_TEAMS.find((t) => t.id === pickTeamId);
        const entry = team?.players.find((p) => p[0] === role && p[1] === pickName);
        if (!team || !entry) return;
        const newP: LineupPlayer = {
          role, name: entry[1], rating: clampRating(entry[2] + (perm[role] ?? 0)), baseRating: entry[2], team: team.team, short: team.short,
          year: team.year, league: team.league, champion: team.champion, finalist: team.finalist, country: entry[3],
        };
        lineup = { ...lineup, [role]: newP };
        buffs.push({ id: `joker-${role}-${entry[1]}`, icon: card.icon, label: `${entry[1]} (${team.short})` });
        break;
      }
      case "swapWithOpp": {
        const role = target?.role;
        if (!role) return;
        const mine = lineup[role];
        const idx = series.opp.players.findIndex((p) => p[0] === role);
        if (!mine || idx < 0) return;
        const oppEntry = series.opp.players[idx];
        const newMine: LineupPlayer = {
          role, name: oppEntry[1], rating: clampRating(oppEntry[2] + (perm[role] ?? 0)), baseRating: oppEntry[2], team: series.opp.team, short: series.opp.short,
          year: series.opp.year, league: series.opp.league, champion: false, country: oppEntry[3],
        };
        const newOpp = series.opp.players.slice();
        newOpp[idx] = [role, mine.name, mine.rating, mine.country];
        lineup = { ...lineup, [role]: newMine };
        const avg = Math.round(newOpp.reduce((a, p) => a + p[2], 0) / newOpp.length);
        series = { ...series, opp: { ...series.opp, players: newOpp, avg } };
        buffs.push({ id: `steal-${role}-${oppEntry[1]}`, icon: card.icon, label: `Roubou ${oppEntry[1]}` });
        break;
      }
      case "bestBuffPerm": {
        if (picks.length) {
          const best = picks.reduce((m, p) => (p.rating > m.rating ? p : m), picks[0]);
          lineup = { ...lineup, [best.role]: { ...best, rating: clampRating(best.rating + card.value) } };
          perm[best.role] = (perm[best.role] ?? 0) + card.value;
          buffs.push({ id: `lenda-${buffs.length}`, icon: card.icon, label: `${best.name} +${card.value}` });
        }
        break;
      }
      case "captainChoose": {
        if (target?.role) {
          for (const p of picks) addYou(p.role, p.role === target.role ? card.value : -1);
        }
        break;
      }
      case "igniteChoose": {
        if (target?.role) {
          addYou(target.role, card.value);
          formNotes = [...formNotes.filter((n) => n.role !== target.role), { side: "you", role: target.role, kind: "fogo", delta: card.value }];
        }
        break;
      }
      case "frontlineBuff": {
        for (const r of ["TOP", "SUP"] as Role[]) if (lineup[r]) addYou(r, card.value);
        break;
      }
      case "roulette": {
        const win = Math.random() < 0.6;
        const d = win ? card.value : -2;
        for (const p of picks) addYou(p.role, d);
        break;
      }
      case "stealBest": {
        // acha o melhor do rival e troca pelo seu da mesma lane (permanente).
        if (series.opp.players.length) {
          const bestOpp = series.opp.players.reduce((m, p) => (p[2] > m[2] ? p : m), series.opp.players[0]);
          const role = bestOpp[0];
          const mine = lineup[role];
          const idx = series.opp.players.findIndex((p) => p[0] === role);
          if (mine && idx >= 0) {
            const oppEntry = series.opp.players[idx];
            lineup = {
              ...lineup,
              [role]: {
                role, name: oppEntry[1], rating: clampRating(oppEntry[2] + (perm[role] ?? 0)), baseRating: oppEntry[2], team: series.opp.team, short: series.opp.short,
                year: series.opp.year, league: series.opp.league, champion: false, country: oppEntry[3],
              },
            };
            const newOpp = series.opp.players.slice();
            newOpp[idx] = [role, mine.name, mine.rating, mine.country];
            const avg = Math.round(newOpp.reduce((a, p) => a + p[2], 0) / newOpp.length);
            series = { ...series, opp: { ...series.opp, players: newOpp, avg } };
            buffs.push({ id: `scout-${role}-${oppEntry[1]}`, icon: card.icon, label: `Roubou ${oppEntry[1]}` });
          }
        }
        break;
      }
      case "thaw": {
        const frozen = formNotes.find((n) => n.kind === "gelado");
        if (frozen) {
          addYou(frozen.role, -frozen.delta + card.value); // cancela o -3 e ainda soma o bônus
          formNotes = formNotes.filter((n) => n !== frozen);
        } else if (picks.length) {
          const weakest = picks.reduce((m, p) => (p.rating < m.rating ? p : m), picks[0]);
          addYou(weakest.role, card.value);
        }
        break;
      }

      // ── cartas RUINS (evento de azar) ──
      case "injureChoose": {
        if (target?.role) addYou(target.role, -card.value);
        break;
      }
      case "teamNerfTemp": {
        for (const p of picks) addYou(p.role, -card.value);
        break;
      }
      case "slumpRandom": {
        if (picks.length) addYou(picks[Math.floor(Math.random() * picks.length)].role, -card.value);
        break;
      }
      case "slumpBest": {
        if (picks.length) {
          const best = picks.reduce((m, p) => (p.rating > m.rating ? p : m), picks[0]);
          addYou(best.role, -card.value);
        }
        break;
      }
      case "freezeRandom": {
        if (picks.length) {
          const victim = picks[Math.floor(Math.random() * picks.length)];
          addYou(victim.role, -card.value);
          formNotes = [...formNotes.filter((n) => n.role !== victim.role), { side: "you", role: victim.role, kind: "gelado", delta: -card.value }];
        }
        break;
      }
      case "oppBuffAll": {
        for (const p of series.opp.players) addOpp(p[0], card.value);
        break;
      }
      case "oppBuffBest": {
        if (series.opp.players.length) {
          const bestOpp = series.opp.players.reduce((m, p) => (p[2] > m[2] ? p : m), series.opp.players[0]);
          addOpp(bestOpp[0], card.value);
        }
        break;
      }
      case "oldestNerf": {
        if (picks.length) {
          const oldest = picks.reduce((m, p) => (p.year < m.year ? p : m), picks[0]);
          addYou(oldest.role, -card.value);
        }
        break;
      }
      case "permNerfChoose": {
        // dano PERMANENTE numa lane à escolha: baixa a nota base + registra o delta negativo (selo -N).
        const role = target?.role;
        if (role && lineup[role]) {
          const p = lineup[role]!;
          lineup = { ...lineup, [role]: { ...p, rating: clampRating(p.rating - card.value) } };
          perm[role] = (perm[role] ?? 0) - card.value;
          buffs.push({ id: `multa-${buffs.length}`, icon: card.icon, label: `${p.name} -${card.value}`, bad: true });
        }
        break;
      }
      case "permNerfBest": {
        if (picks.length) {
          const best = picks.reduce((m, p) => (p.rating > m.rating ? p : m), picks[0]);
          lineup = { ...lineup, [best.role]: { ...best, rating: clampRating(best.rating - card.value) } };
          perm[best.role] = (perm[best.role] ?? 0) - card.value;
          buffs.push({ id: `queda-${buffs.length}`, icon: card.icon, label: `${best.name} -${card.value}`, bad: true });
        }
        break;
      }
      case "doubleEdge": {
        for (const p of series.opp.players) addOpp(p[0], card.value); // rival +value
        for (const p of picks) addYou(p.role, -(card.value2 ?? 1)); // você -value2
        break;
      }
      case "badRoulette": {
        if (picks.length) {
          if (Math.random() < 0.5) {
            for (const p of picks) addYou(p.role, -2);
          } else {
            addYou(picks[Math.floor(Math.random() * picks.length)].role, -card.value);
          }
        }
        break;
      }
    }

    dispatch({ type: "resolveEvent", lineup, series, seriesMods: mods, permMods: perm, formNotes, activeBuffs: buffs });
  }, []);

  const clearFlashes = useCallback(() => dispatch({ type: "clearFlashes" }), []);

  const openCodex = useCallback(() => dispatch({ type: "openCodex" }), []);
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
          ? "🏆 GOLDENROAD — 6-0 PERFEITO, campeão do mundo!"
          : `🏆 GOLDENROAD — CAMPEÃO DO MUNDO (${wins}-${losses})!`
        : `GOLDENROAD — minha campanha terminou em ${wins}-${losses}.`;
    const fmvp = S.finished === "champion" ? S.finalsMvp : null;
    const mvpLine = fmvp ? `\n🏆 MVP das Finais: ${fmvp.name} (${fmvp.role === "BOT" ? "ADC" : fmvp.role})` : "";
    const scoreLine = S.runScore ? `\n⭐ Pontuação: ${S.runScore.total.toLocaleString("pt-BR")}${S.isNewScoreRecord ? " (recorde!)" : ""}` : "";
    const txt = `${header}\n${line}\nNota da line: ${avg}.${scoreLine}${mvpLine} Consegue superar?`;
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

    // ---- logo em duas linhas: GOLDEN (cima) / R[nexus]AD (baixo) ----
    const logoFont = "400 92px 'Bebas Neue', sans-serif";
    // linha de cima: GOLDEN
    x.font = logoFont;
    x.textAlign = "center";
    x.fillStyle = "#e8ce86";
    x.fillText("GOLDEN", W / 2, 166);
    // linha de baixo: R [nexus] AD, centralizada (próxima da de cima)
    const ring = 30; // meio-lado do quadrado "0"
    const arm = 16; // meia-diagonal do X
    const gap = 12;
    const baseY = 244; // baseline do texto da linha de baixo
    const ringCy = baseY - 32; // centro do glifo na altura visual das caps
    const wR = x.measureText("R").width;
    const wAD = x.measureText("AD").width;
    const lineW = wR + gap + ring * 2 + gap + wAD;
    const lx = W / 2 - lineW / 2;
    const ringCx = lx + wR + gap + ring;
    // "R"
    x.textAlign = "left";
    x.fillStyle = "#e8ce86";
    x.fillText("R", lx, baseY);
    // glifo-nexus: quadrado de cantos arredondados + X (rio azul \ × mid dourada /)
    x.lineCap = "round";
    x.lineJoin = "round";
    x.strokeStyle = "#d8b45a";
    x.lineWidth = 11;
    rr(ringCx - ring, ringCy - ring, ring * 2, ring * 2, ring * 0.32);
    x.stroke();
    x.strokeStyle = "#6aa0da";
    x.beginPath();
    x.moveTo(ringCx - arm, ringCy - arm);
    x.lineTo(ringCx + arm, ringCy + arm);
    x.stroke();
    x.strokeStyle = "#d8b45a";
    x.beginPath();
    x.moveTo(ringCx - arm, ringCy + arm);
    x.lineTo(ringCx + arm, ringCy - arm);
    x.stroke();
    // "AD"
    x.fillStyle = "#e8ce86";
    x.fillText("AD", ringCx + ring + gap, baseY);
    x.textAlign = "center";

    // subtítulo (status da campanha)
    x.fillStyle = isChampion ? "#e8ce86" : "#d2a08e";
    x.font = "700 25px 'Geist', sans-serif";
    x.fillText(subtitle.toUpperCase(), W / 2, 292);

    // ---- bloco da NOTA DA LINE (card destacado, estilo "Média do elenco") ----
    const nbY = 316;
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
    // ESQUERDA: nota da line + tier (subtexto). DIREITA: PONTUAÇÃO da run (destaque).
    const runScore = S.runScore;
    x.textAlign = "left";
    x.fillStyle = "#9097a1";
    x.font = "400 17px 'Geist', sans-serif";
    x.fillText("NOTA DA LINE", nbX + 34, nbY + 26);
    x.fillStyle = "#e8ce86";
    x.font = "700 70px 'Geist', sans-serif";
    x.fillText(String(avg), nbX + 34, nbY + 84);
    x.fillStyle = "#9097a1";
    x.font = "400 15px 'Geist', sans-serif";
    x.fillText(`${tierLabel} · ${champs}/5 CAMPEÕES`, nbX + 34, nbY + 108);
    // direita: pontuação
    x.textAlign = "right";
    if (runScore) {
      x.fillStyle = "#9097a1";
      x.font = "400 17px 'Geist', sans-serif";
      x.fillText("PONTUAÇÃO", nbX + nbW - 30, nbY + 26);
      x.fillStyle = "#f4e4b0";
      x.font = "800 58px 'Geist', sans-serif";
      x.fillText(runScore.total.toLocaleString("pt-BR"), nbX + nbW - 30, nbY + 80);
      if (runScore.zebraDiff >= 2) {
        x.fillStyle = "#7fd18a";
        x.font = "700 15px 'Geist', sans-serif";
        x.fillText(`🐴 ZEBRA ×${runScore.zebraMult.toFixed(2)}`, nbX + nbW - 30, nbY + 106);
      }
    } else {
      x.fillStyle = "#f2ecde";
      x.font = "700 30px 'Geist', sans-serif";
      x.fillText(tierLabel, nbX + nbW - 30, nbY + 64);
    }

    // ---- linhas dos jogadores (estilo dos cards de raridade do draft) ----
    const hasFmvp = isChampion && !!S.finalsMvp;
    const rowH = 78;
    const rowGap = 12;
    const rowX = 100;
    const rowW = W - 200;
    let y = 492;
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
    x.fillText(footer + "  ·  goldenroad", W / 2, H - 64);
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
    resolveEventCard,
    clearFlashes,
    openCodex,
    restart,
    copyResult,
    downloadCard,
  };
}

export type Game = ReturnType<typeof useGame>;

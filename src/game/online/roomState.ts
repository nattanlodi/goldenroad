// ============================================================
// ESTADO DE SALA ONLINE 1v1 (Degrau 1) — sincronizado pelo host
// ============================================================
// Este é o estado `S` que vive no RoomClient (host-autoritativo). O host detém a
// fonte da verdade; clientes mandam INTENÇÕES (`RoomIntent`) e recebem o snapshot.
//
// Por enquanto cobre só a fase LOBBY (1º bloco do 1v1): host cria a sala, o 2º
// jogador entra, os dois ficam "prontos", o host inicia. As fases draft/série
// entram em blocos seguintes, estendendo este mesmo estado/reduce.
//
// IMPORTANTE: nada de Date.now()/random no reduce — o reducer roda no host e deve
// ser puro a partir de (estado, intenção, ctx). Timestamps/seed entram pelo ctx
// ou por intenções específicas (ex.: o host inicia com um deadline já calculado).

import type { ReduceCtx } from "../../net/roomClient";
import type { RoomConfig } from "../tournamentReducer";
import type { CardRarity, EventCard, Role } from "../../types";
import type { TournamentPick, Bracket } from "../tournament";
import type { GameTimeline } from "../timeline";
import type { OnlineCardTarget } from "./cardEngine";

// "series" = duelo 1v1 puro (Degrau 1, sem bots no bracket).
// "bracket" = torneio de 8 com chaveamento persistente (Degrau 2).
export type OnlinePhase = "lobby" | "draft" | "series" | "bracket" | "result";

export const DRAFT_ROUNDS = 5; // 5 picks = 5 lanes
export const BRACKET_SIZE = 8; // o bracket é SEMPRE de 8 (humanos + bots)
export const MAX_HUMANS = 8; // até 8 humanos; bots completam até BRACKET_SIZE

/** Um competidor da sala: humano (line draftada) OU bot (line pré-gerada). É o
 * registro OFICIAL do host; humanos espelham o Presence. */
export interface RoomPlayer {
  playerId: string;
  nick: string;
  isHost: boolean;
  /** bot preenchedor (line própria desde o início, nome 🤖). */
  isBot: boolean;
  /** marcou "pronto" no lobby (sempre true pros bots). */
  ready: boolean;
  /** ── draft ── line por role. Humano: preenche rodada a rodada; bot: já completa. */
  picks: Partial<Record<Role, TournamentPick>>;
  /** já escolheu nesta rodada? (zera a cada nova rodada; sempre true pros bots). */
  pickedThisRound: boolean;
}

/** Estado completo da sala 1v1 que o host transmite. */
export interface RoomState {
  phase: OnlinePhase;
  /** código da sala (= origem da seed determinística via seedFromCode). */
  code: string;
  /** config da sala (só o host edita no lobby). */
  config: RoomConfig;
  /** os jogadores na sala, na ordem de chegada (máx. 2 no Degrau 1). */
  players: RoomPlayer[];

  // ── draft (fase "draft") ──
  /** rodada atual do draft (1..DRAFT_ROUNDS). */
  draftRound: number;
  /** timestamp (ms) em que a rodada acaba; null = sem limite (espera todos). */
  roundDeadline: number | null;

  // ── série em andamento (1v1 OU confronto atual do bracket) ──
  series: SeriesState | null;

  // ── bracket persistente de 8 (fase "bracket") ──
  bracket: Bracket | null;
  /** matchIds das séries COM humano a jogar, na ordem (HxH primeiro, depois HxBot). */
  bracketQueue: string[];
  /** índice da série atual na fila. */
  queueIndex: number;
  /** countdown (ms) de início da série atual do bracket (10s, §design). */
  bracketStartDeadline: number | null;
  /** série calculada AGUARDANDO o host clicar "Iniciar" (sem countdown rolando).
   * null = não há série pendente (ou já está em andamento via `series`). */
  pendingSeries: SeriesState | null;
  pendingSideMatches: SideMatch[];
  /** modo PARALELO: todas as séries com humano da fase rodando ao mesmo tempo;
   * cada cliente narra a SUA. Vazio no modo coletivo (usa `series`/`pendingSeries`). */
  parallelSeries: SeriesState[];
  /** modo paralelo: a fase está PRONTA aguardando o host disparar todas. */
  parallelPending: boolean;
  /** bot×bot da fase atual revelando em paralelo (placar parcial no bracket),
   * casadas com a série do humano ±3s. Reveladas localmente pelo schedule. */
  sideMatches: SideMatch[];

  // ── resultado (fase "result") ──
  /** playerId do vencedor (duelo 1v1 OU campeão do torneio). */
  winnerId: string | null;
}

/** Uma série bot×bot revelando em paralelo (jogo a jogo) no bracket. */
export interface SideMatch {
  matchId: string;
  /** resultados pré-simulados (true = lado A do confronto venceu). */
  games: boolean[];
  /** placar final (pra o host aplicar no bracket ao concluir). */
  finalA: number;
  finalB: number;
  /** timestamp (ms) em que cada jogo deve ser revelado (casado ±3s com a série do humano). */
  schedule: number[];
}

/** Escolha de carta de um lado (id da carta + alvo, se a carta exigir). */
export interface CardChoice {
  cardId: string;
  target: OnlineCardTarget | null;
}

/** Subfase de CARTAS de uma série (PvP simétrico). Aparece ANTES de simular:
 * os dois lados recebem trios do MESMO nível (cartas distintas) e escolhem. Só
 * depois que os dois escolheram o host SIMULA a Bo5 com as lines modificadas.
 * As cartas trafegam (são pequenas: ids + nível); o efeito é aplicado local e
 * deterministicamente em host/clientes (mesma seed → mesma line). */
export interface SeriesCards {
  rarity: CardRarity;
  hostile: boolean;
  /** trios sorteados (host); cada lado vê o seu e escolhe 1. */
  trioA: EventCard[];
  trioB: EventCard[];
  /** escolha de cada lado (null = ainda não escolheu). */
  pickA: CardChoice | null;
  pickB: CardChoice | null;
  /** countdown (ms) pra escolher (10s); ao zerar, auto-pick aleatório. */
  deadline: number | null;
}

/** Estado da Bo5 ao vivo, narrada pelo host e espelhada nos dois. */
export interface SeriesState {
  /** lados do confronto (A = primeiro player; B = segundo). */
  aId: string;
  bId: string;
  /** subfase de cartas (cardsOn): preenchida ANTES da série simular. null = sem
   * cartas (ou já resolvidas). Enquanto `cards` existe e falta escolha, a série
   * NÃO simula nem narra — espera os picks. */
  cards: SeriesCards | null;
  /** salt da seed do confronto (= matchId). As timelines NÃO trafegam na rede
   * (são grandes e fariam o snapshot ser descartado); cada cliente as REGENERA
   * localmente por este salt + competidores. */
  seedSalt: string;
  /** countdown de início (timestamp ms) — null quando já começou. */
  startDeadline: number | null;
  /** placar atual (sobe jogo a jogo). */
  scoreA: number;
  scoreB: number;
  /** placar FINAL pré-simulado (a série inteira já foi decidida pela seed). */
  finalA: number;
  finalB: number;
  /** resultado de cada jogo (true = A venceu), na ordem. */
  games: boolean[];
  /** pentakills reais por jogo (lado + nome). */
  pentasByGame: { side: "a" | "b"; name: string }[][];
  /** timelines por jogo (modo imersivo; vazio no rápido). */
  timelines: GameTimeline[];
  /** índice do jogo sendo narrado. */
  gameIndex: number;
  /** índice do evento atual dentro da timeline do jogo. */
  eventIndex: number;
  /** terminou de narrar tudo? (mostra resultado + avançar). */
  finished: boolean;
}

/** Config inicial do lobby online. O modo de séries é SEMPRE paralelo ("cada um
 * vê a sua") — o modo coletivo foi removido. */
const DEFAULT_CONFIG: RoomConfig = {
  humanCount: 2,
  pickSeconds: 30,
  hideRatings: false,
  cardsOn: false,
  pace: "imersivo",
  seriesMode: "paralelo",
};

/** Estado inicial criado pelo HOST ao abrir a sala. Começa SEM players: cada um
 * (host inclusive) se registra via o `join` automático, com seu playerId real. */
export function initialRoomState(code: string): RoomState {
  return {
    phase: "lobby",
    code,
    config: DEFAULT_CONFIG,
    players: [],
    draftRound: 1,
    roundDeadline: null,
    series: null,
    bracket: null,
    bracketQueue: [],
    queueIndex: 0,
    bracketStartDeadline: null,
    pendingSeries: null,
    pendingSideMatches: [],
    parallelSeries: [],
    parallelPending: false,
    sideMatches: [],
    winnerId: null,
  };
}

// ── intenções (cliente → host) ──
// Obs.: ROLAR time é 100% local/privado (não vira intenção). Só o PICK final e os
// avanços de rodada (controlados pelo host) trafegam.
export type RoomIntent =
  | { kind: "join"; nick: string } // entrei na sala (registra/atualiza meu nick)
  | { kind: "setConfig"; patch: Partial<RoomConfig> } // host ajusta config
  | { kind: "setReady"; ready: boolean } // marcar/desmarcar pronto
  | { kind: "start"; deadline: number | null; bots: RoomPlayer[] } // host inicia o draft (rodada 1 + bots preenchedores)
  | { kind: "draftPick"; role: Role; pick: TournamentPick } // escolhi um jogador nesta rodada
  | { kind: "advanceRound"; round: number; deadline: number | null; autopicks: AutoPick[] } // host avança rodada (+ auto-picks)
  | { kind: "finishDraft"; autopicks: AutoPick[]; bracket: Bracket; queue: string[] } // host conclui o draft → fase bracket (8 lines + chaveamento montado)
  | { kind: "armNextSeries"; series: SeriesState; sideMatches: SideMatch[] } // host deixa a próxima série PRONTA (aguardando o botão Iniciar)
  | { kind: "openBracketSeries"; series: SeriesState; deadline: number | null; sideMatches: SideMatch[] } // host inicia a série (countdown rolando)
  | { kind: "armParallel" } // host: fase paralela pronta (aguardando "Iniciar rodada")
  | { kind: "startParallel"; series: SeriesState[]; sideMatches: SideMatch[] } // host dispara TODAS as séries da fase de uma vez
  | { kind: "pickCard"; choice: CardChoice } // escolhi minha carta na subfase de cartas (lado A ou B, deduzido por quem envia)
  | { kind: "resolveCards"; series: SeriesState; sideMatches: SideMatch[] } // host: os dois escolheram → aplicou efeitos, simulou, série pronta pra narrar (+ bot×bot re-agendadas)
  | { kind: "resolveCardsParallel"; series: SeriesState[]; sideMatches: SideMatch[] } // host: resolve as cartas de TODAS as séries paralelas de uma vez
  | { kind: "seriesTick"; series: SeriesState } // host avança a narração da série (placar/timeline)
  | { kind: "resolveBracketSeries"; bracket: Bracket; queue: string[]; queueIndex: number } // host aplica resultado(s) + propaga + avança a fila
  | { kind: "finishTournament"; winnerId: string; bracket: Bracket } // final terminou → pódio (com o bracket FINAL resolvido)
  | { kind: "leave" }; // sair da sala

/** Auto-pick que o host aplica a quem não escolheu ao zerar o timer. */
export interface AutoPick {
  playerId: string;
  role: Role;
  pick: TournamentPick;
}

/** Só os HUMANOS da sala (bots não contam pro lobby/prontos). */
export function humansOf(state: RoomState): RoomPlayer[] {
  return state.players.filter((p) => !p.isBot);
}

/** Reduce host-autoritativo: aplica uma intenção ao estado. Puro. */
export function reduceRoom(state: RoomState, intent: RoomIntent, ctx: ReduceCtx): RoomState {
  switch (intent.kind) {
    case "join": {
      const exists = state.players.find((p) => p.playerId === ctx.from);
      if (exists) {
        // reconexão / renome: atualiza o nick, mantém o resto.
        return {
          ...state,
          players: state.players.map((p) =>
            p.playerId === ctx.from ? { ...p, nick: intent.nick || p.nick } : p
          ),
        };
      }
      // sala cheia de HUMANOS → ignora (a UI mostra "sala cheia" por outra via).
      if (humansOf(state).length >= MAX_HUMANS) return state;
      // só entra no lobby (não no meio do jogo).
      if (state.phase !== "lobby") return state;
      // o host é quem roda o reduce: ctx.from === ctx.hostId identifica o host.
      const isHost = ctx.from === ctx.hostId;
      return {
        ...state,
        players: [
          ...state.players,
          {
            playerId: ctx.from,
            nick: intent.nick || (isHost ? "Host" : "Convidado"),
            isHost,
            isBot: false,
            ready: false,
            picks: {},
            pickedThisRound: false,
          },
        ],
      };
    }

    case "setConfig": {
      // só o host edita a config.
      if (ctx.from !== ctx.hostId) return state;
      return { ...state, config: { ...state.config, ...intent.patch } };
    }

    case "setReady": {
      return {
        ...state,
        players: state.players.map((p) =>
          p.playerId === ctx.from ? { ...p, ready: intent.ready } : p
        ),
      };
    }

    case "start": {
      // só o host inicia: mín. 2 humanos, todos os HUMANOS prontos. Os BOTS (já
      // gerados pelo host) completam até BRACKET_SIZE.
      if (ctx.from !== ctx.hostId) return state;
      if (state.phase !== "lobby") return state;
      const humans = humansOf(state);
      if (humans.length < 2) return state;
      if (!humans.every((p) => p.ready)) return state;
      // entra no draft: rodada 1 + bots preenchedores (line completa, já "prontos").
      const bots: RoomPlayer[] = intent.bots.map((b) => ({
        ...b,
        ready: true,
        pickedThisRound: true, // bots não draftam (line já pronta)
      }));
      return {
        ...state,
        phase: "draft",
        draftRound: 1,
        roundDeadline: intent.deadline,
        players: [
          ...humans.map((p) => ({ ...p, picks: {}, pickedThisRound: false })),
          ...bots.slice(0, Math.max(0, BRACKET_SIZE - humans.length)),
        ],
      };
    }

    case "draftPick": {
      // registra o pick do jogador NESTA rodada (uma vez por rodada).
      if (state.phase !== "draft") return state;
      return {
        ...state,
        players: state.players.map((p) =>
          p.playerId === ctx.from && !p.pickedThisRound
            ? { ...p, picks: { ...p.picks, [intent.role]: intent.pick }, pickedThisRound: true }
            : p
        ),
      };
    }

    case "advanceRound": {
      // só o host avança a rodada (aplica auto-picks de quem não escolheu).
      if (ctx.from !== ctx.hostId || state.phase !== "draft") return state;
      const autoByPlayer = new Map<string, AutoPick>();
      for (const a of intent.autopicks) autoByPlayer.set(a.playerId, a);
      return {
        ...state,
        draftRound: intent.round,
        roundDeadline: intent.deadline,
        players: state.players.map((p) => {
          const auto = autoByPlayer.get(p.playerId);
          const picks = auto && !p.pickedThisRound ? { ...p.picks, [auto.role]: auto.pick } : p.picks;
          // BOTS nunca draftam (line já pronta) → seguem sempre "prontos"; só os
          // humanos zeram pra escolher de novo na próxima rodada.
          return { ...p, picks, pickedThisRound: p.isBot };
        }),
      };
    }

    case "finishDraft": {
      // host conclui: aplica auto-picks da última rodada e vai pro BRACKET (já montado).
      if (ctx.from !== ctx.hostId || state.phase !== "draft") return state;
      const autoByPlayer = new Map<string, AutoPick>();
      for (const a of intent.autopicks) autoByPlayer.set(a.playerId, a);
      return {
        ...state,
        phase: "bracket",
        roundDeadline: null,
        bracket: intent.bracket,
        bracketQueue: intent.queue,
        queueIndex: 0,
        series: null,
        players: state.players.map((p) => {
          const auto = autoByPlayer.get(p.playerId);
          const picks = auto && !p.pickedThisRound ? { ...p.picks, [auto.role]: auto.pick } : p.picks;
          return { ...p, picks, pickedThisRound: true };
        }),
      };
    }

    case "armNextSeries": {
      // host deixa a próxima série PRONTA (mostra confronto + botão Iniciar).
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      return { ...state, pendingSeries: intent.series, pendingSideMatches: intent.sideMatches };
    }

    case "armParallel": {
      // modo paralelo: a fase está pronta (mostra "Iniciar rodada" pro host).
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      return { ...state, parallelPending: true };
    }

    case "startParallel": {
      // host disparou TODAS as séries da fase de uma vez.
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      return {
        ...state,
        parallelPending: false,
        parallelSeries: intent.series,
        sideMatches: intent.sideMatches,
      };
    }

    case "openBracketSeries": {
      // host INICIA a série (countdown rolando) — limpa o pendente.
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      return {
        ...state,
        series: intent.series,
        sideMatches: intent.sideMatches,
        bracketStartDeadline: intent.deadline,
        pendingSeries: null,
        pendingSideMatches: [],
      };
    }

    case "pickCard": {
      // registra a escolha de carta de quem enviou (lado A ou B da SUA série).
      if (state.phase !== "bracket") return state;
      const apply = (s: SeriesState | null): SeriesState | null => {
        if (!s || !s.cards) return s;
        if (s.aId === ctx.from && !s.cards.pickA) return { ...s, cards: { ...s.cards, pickA: intent.choice } };
        if (s.bId === ctx.from && !s.cards.pickB) return { ...s, cards: { ...s.cards, pickB: intent.choice } };
        return s;
      };
      return {
        ...state,
        series: apply(state.series),
        parallelSeries: state.parallelSeries.map((s) => apply(s) ?? s),
      };
    }

    case "resolveCards": {
      // host: os dois escolheram (ou auto-pick) → série já com lines aplicadas e
      // Bo5 simulada; cards.deadline zerado pra liberar a narração. As bot×bot
      // são re-agendadas pra casar com o NOVO início (depois da janela de cartas).
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      return { ...state, series: intent.series, sideMatches: intent.sideMatches, bracketStartDeadline: intent.series.startDeadline };
    }

    case "resolveCardsParallel": {
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      return { ...state, parallelSeries: intent.series, sideMatches: intent.sideMatches };
    }

    case "seriesTick": {
      // host avança a narração (placar/timeline/finished). Clientes só renderizam.
      if (ctx.from !== ctx.hostId) return state;
      return { ...state, series: intent.series, bracketStartDeadline: intent.series.startDeadline };
    }

    case "resolveBracketSeries": {
      // host aplicou o(s) resultado(s) ao bracket e avançou a fila.
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      return {
        ...state,
        bracket: intent.bracket,
        bracketQueue: intent.queue,
        queueIndex: intent.queueIndex,
        series: null,
        bracketStartDeadline: null,
        sideMatches: [],
        parallelSeries: [],
        parallelPending: false,
      };
    }

    case "finishTournament": {
      if (ctx.from !== ctx.hostId || state.phase !== "bracket") return state;
      // aplica o BRACKET FINAL (com a grande final resolvida) — senão o pódio
      // mostraria os finalistas como "quartas" (bracket sem os últimos resultados).
      return { ...state, phase: "result", winnerId: intent.winnerId, bracket: intent.bracket, series: null, parallelSeries: [], bracketStartDeadline: null };
    }

    case "leave": {
      const next = state.players.filter((p) => p.playerId !== ctx.from);
      // se o host saiu, a sala morre por outra via (RoomClient manda "bye").
      return { ...state, players: next };
    }
  }
}

/** Quem é o jogador correspondente a um playerId (ou null). */
export function playerOf(state: RoomState, playerId: string): RoomPlayer | null {
  return state.players.find((p) => p.playerId === playerId) ?? null;
}

/** Todos os jogadores já escolheram nesta rodada? (gatilho de avanço antecipado). */
export function allPickedThisRound(state: RoomState): boolean {
  return state.players.length > 0 && state.players.every((p) => p.pickedThisRound);
}

/** Quem ainda NÃO escolheu nesta rodada (recebe auto-pick ao zerar o timer). */
export function pendingThisRound(state: RoomState): RoomPlayer[] {
  return state.players.filter((p) => !p.pickedThisRound);
}

/** Lanes ainda vazias na line de um jogador (pro auto-pick escolher uma). */
export function emptyRoles(p: RoomPlayer, roles: readonly Role[]): Role[] {
  return roles.filter((r) => !p.picks[r]);
}

/** Sala pronta pra começar? (mín. 2 humanos + todos os humanos prontos). */
export function canStart(state: RoomState): boolean {
  const humans = humansOf(state);
  return state.phase === "lobby" && humans.length >= 2 && humans.every((p) => p.ready);
}

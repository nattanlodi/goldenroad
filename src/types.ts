// Tipos centrais do 6×0 Worlds.

export type Role = "TOP" | "JNG" | "MID" | "BOT" | "SUP";

/** Jogador dentro do dataset: [role, nome, overall, país?].
 *  O 4º item é o código ISO 3166-1 alpha-2 minúsculo (ex.: "kr", "br") — opcional. */
export type RosterEntry = [Role, string, number, string?];

/** Torneio de origem de uma campanha. */
export type Tournament = "worlds" | "msi";

/** Uma campanha (time + ano + torneio). */
export interface Team {
  id: string;
  team: string;
  short: string;
  year: number;
  league: string;
  /** torneio de origem. Ausente = "worlds" (default, retrocompat com os arquivos antigos). */
  tournament?: Tournament;
  champion: boolean;
  /** Vice-campeão: perdeu a final daquele torneio. */
  finalist?: boolean;
  players: RosterEntry[];
}

/** Jogador já escolhido e alocado numa lane da sua line. */
export interface LineupPlayer {
  role: Role;
  /** nota EFETIVA (pode subir/descer por buffs permanentes de carta). */
  rating: number;
  /** nota ORIGINAL do jogador — nunca alterada por buff (pra exibir a real). */
  baseRating: number;
  name: string;
  team: string;
  short: string;
  year: number;
  league: string;
  tournament?: Tournament; // torneio de origem (default worlds)
  champion: boolean;
  finalist?: boolean;
  country?: string;
}

export type Lineup = Record<Role, LineupPlayer | null>;

export type Difficulty = "classico" | "especialista";

export type Phase = "start" | "play" | "series" | "result" | "codex";

// ---- campanha / playoffs ----

export type StageKey = "swiss" | "quarter" | "semi" | "final";

/** Fase atual da campanha. */
export type StagePhase = "swiss" | "ko";

// ---- modo GOLDENROAD: MSI (double elimination) ----

/** Nó do bracket do MSI no caminho do JOGADOR (double elim). */
export type MsiNode =
  | "UR1" // Upper Round 1
  | "UR2" // Upper Round 2
  | "UF" // Upper Final
  | "LR1" // Lower Round 1
  | "LR2" // Lower Round 2
  | "LR3" // Lower Round 3
  | "LF" // Lower Final
  | "GF"; // Grand Final

/** Lado do bracket onde o jogador chega à Grand Final (ou em que se encontra). */
export type MsiSide = "upper" | "lower";

/** Nó do bracket do FIRST STAND no caminho do JOGADOR. Fase de grupos (double
 *  elim de 4 times) → knockout (semi + grande final). Tudo Bo5. */
export type FsNode =
  | "USF" // Upper Semifinal (grupo)
  | "UBF" // Upper Bracket Final (grupo) — vencer = classificado
  | "LBF" // Lower Bracket Final (grupo) — última chance de classificar
  | "KSF" // Knockout Semifinal
  | "KGF"; // Knockout Grand Final

/** Lado do bracket do First Stand (upper/lower) — só pra "vida" na UI. */
export type FsSide = "upper" | "lower";

/** Modo de jogo. "worlds" = só o Worlds (atual). "goldenroad" = carreira (First Stand → MSI → Worlds). */
export type GameMode = "worlds" | "goldenroad";

/** Etapa atual do modo carreira GOLDENROAD. */
export type CareerStage = "first_stand" | "msi" | "worlds";

/** Time adversário de uma série, já com a média de overall pré-calculada. */
export interface Opponent {
  id: string;
  team: string;
  short: string;
  year: number;
  league: string;
  tournament?: Tournament; // torneio de origem da campanha (default worlds)
  players: RosterEntry[];
  avg: number;
}

/** Configuração de uma série a ser jogada. */
export interface SeriesSetup {
  stageKey: StageKey;
  stageLabel: string; // "Fase Suíça" / "Quartas de final" / ...
  format: string; // "Bo1" / "Bo3" / "Bo5"
  target: number; // vitórias necessárias (1 / 2 / 3)
  decisive: boolean; // série suíça que avança ou elimina
  opp: Opponent;
}

/** Lado de um destaque: seu time ou o adversário. */
export type Side = "you" | "opp";

/** Referência leve a um jogador (de qualquer lado) num destaque. */
export interface HighlightRef {
  side: Side;
  role: Role;
  name: string;
  rating: number;
  country?: string;
}

/** Um pentakill ocorrido durante uma série: quem fez, de qual lado e em qual jogo (1-based). */
export interface Pentakill {
  side: Side;
  role: Role;
  name: string;
  country?: string;
  gameNumber: number;
}

/** MVP de uma única partida da série (do time que venceu aquele jogo). */
export interface GameMvp extends HighlightRef {
  gameNumber: number;
}

/** Resumo ao vivo de uma partida já disputada (histórico em tempo real). */
export interface LiveGame {
  gameNumber: number;
  youWon: boolean;
  mvp: GameMvp | null;
  pentakills: Pentakill[];
  /** rótulo da série/fase a que esta partida pertence (ex.: "Quartas de final"). */
  stageLabel?: string;
  /** índice da série na campanha (pra agrupar/numerar no histórico). */
  seriesIndex?: number;
  /** formato da série (Bo1 / Bo3 / Bo5). */
  format?: string;
  /** nome curto do adversário daquela série. */
  oppShort?: string;
  /** ano do adversário (sufixo do card). */
  oppYear?: number;
  /** rodada da Fase Suíça (1..n) — só preenchido em séries suíças. */
  swissRound?: number;
}

/** Destaques de uma série: pentakills, MVP de cada partida e o MVP eleito ao fim. */
export interface SeriesHighlight {
  pentakills: Pentakill[];
  gameMvps: GameMvp[];
  mvp: HighlightRef | null;
}

/** Resultado de uma série já disputada (entra no histórico da jornada). */
export interface PlayedSeries {
  stageKey: StageKey;
  stageLabel: string;
  format: string;
  opp: Opponent;
  yourGames: number;
  oppGames: number;
  won: boolean;
  /** campeonato a que a série pertenceu — MSI ou Worlds (modo GOLDENROAD).
   *  No modo Worlds avulso, sempre "worlds". Permite agrupar a jornada por torneio. */
  championship: CareerStage;
}

export type CampaignEnd = "champion" | "eliminated";

// ============================================================
// Eventos de pré-série (cartas estilo ARAM) + Forma do dia
// ============================================================

/** Deltas TEMPORÁRIOS de overall, válidos só na série atual (zeram ao trocar de
 *  oponente). Aplicados sobre a nota base na simulação e no display. */
export interface SeriesMods {
  you: Partial<Record<Role, number>>;
  opp: Partial<Record<Role, number>>;
}

/** Forma do dia de um jogador SEU, exibida como badge na linha. */
export type FormKind = "fogo" | "gelado";
export interface FormNote {
  side: Side;
  role: Role;
  kind: FormKind;
  /** delta aplicado (já refletido em SeriesMods) — só pra texto. */
  delta: number;
}

/** Raridade de uma carta de evento (controla peso do sorteio + visual). */
export type CardRarity = "comum" | "rara" | "lendaria";

/** Tipo de efeito — o handler em useGame sabe como aplicar cada um e se
 *  precisa de um alvo (escolher jogador). */
export type CardKind =
  | "teamBuff" // +N permanente em todos
  | "teamBuffTemp" // +N em todos, só nesta série
  | "roleBuffRandom" // +N temp numa role sorteada sua
  | "roleBuffChoose" // +N temp numa role que VOCÊ escolhe (alvo: sua role)
  | "weakestBuff" // +N temp no seu menor overall
  | "weakestBuffPerm" // +N permanente no seu menor overall
  | "oldestBuff" // +N temp no seu jogador de edição mais antiga
  | "bestBuffPerm" // +N permanente no seu MAIOR overall
  | "captainChoose" // +N numa lane sua à escolha, -1 nas outras (essa série)
  | "igniteChoose" // põe um jogador seu EM CHAMAS (🔥 +3) essa série (alvo: sua role)
  | "frontlineBuff" // +N no TOP e SUP, essa série
  | "roulette" // aposta: chance de +5 no time / risco de -2 (essa série)
  | "nerfOpp" // -N temp num jogador do rival (alvo: opp)
  | "nerfOppAll" // -N temp em todo o rival
  | "stealBest" // rouba o MELHOR do rival pro seu time na mesma lane (permanente)
  | "swapOwnRole" // troca um seu por qualquer jogador da mesma role (alvo: tabela)
  | "swapWithOpp" // troca um seu por um do rival na mesma role (alvo: par)
  | "thaw" // remove o gelado de um jogador + bônus
  // ── cartas RUINS (evento de azar: escolher o mal menor) ──
  | "injureChoose" // -N temp num jogador SEU à escolha (alvo: sua role)
  | "teamNerfTemp" // -N temp em TODA a sua line
  | "slumpRandom" // -N temp num jogador SEU aleatório
  | "slumpBest" // -N temp no seu MELHOR jogador
  | "freezeRandom" // aplica 🧊 Gelado (-N) num jogador SEU aleatório
  | "oppBuffAll" // +N temp em TODO o rival
  | "oppBuffBest" // +N temp no MELHOR jogador do rival
  | "oldestNerf" // -N temp no seu jogador de edição mais antiga
  | "permNerfChoose" // -N PERMANENTE numa lane SUA à escolha (alvo: sua role)
  | "permNerfBest" // -N PERMANENTE no seu MELHOR jogador
  | "doubleEdge" // rival +Nopp e sua line -Nyou, só nesta série
  | "badRoulette"; // roleta ruim: 50% -2 na line / 50% -5 num aleatório

/** Uma carta de evento sorteável. */
export interface EventCard {
  id: string;
  name: string;
  desc: string;
  icon: string; // emoji
  rarity: CardRarity;
  kind: CardKind;
  value: number; // magnitude (ex.: +1, +2, -3)
  permanent: boolean; // efeito vale a run inteira (true) ou só a próxima série (false)
  /** precisa de uma etapa de escolha de alvo após selecionar a carta. */
  needsTarget: boolean;
  /** carta RUIM — entra no baralho de "evento de azar" (escolher o mal menor). */
  hostile?: boolean;
  /** magnitude secundária (ex.: doubleEdge usa value=buff rival, value2=nerf seu). */
  value2?: number;
}

/** Buff PERMANENTE ativo na run (só pra exibir no HUD). */
export interface ActiveBuff {
  id: string;
  icon: string;
  label: string;
  /** penalidade permanente (carta de azar) — renderiza em vermelho no HUD. */
  bad?: boolean;
}

/** Alvo escolhido para uma carta que precisa de seleção. */
export interface CardTarget {
  role?: Role; // lane envolvida (nerf, trocas)
  pickTeamId?: string; // time do jogador escolhido (curinga)
  pickName?: string; // nome do jogador escolhido (curinga)
}

// ============================================================
// RoomClient — máquina de estados HOST-AUTORITATIVA sobre o Transport
// ============================================================
// Esta é a peça central do Degrau 1 (§3 do design). Ela NÃO conhece Supabase
// (usa um Transport injetado) nem o jogo em si (é genérica no tipo do estado
// `S` e da intenção `I`). O jogo pluga as regras via `reduce`.
//
// Modelo (host-autoritativo):
//   • Quem cria a sala é o HOST → roda a lógica-mestre e detém o snapshot oficial.
//   • Clientes mandam INTENÇÕES ("quero pegar o Faker no MID"); não decidem nada.
//   • Host valida via reduce(estado, intenção, ctx) → novo estado → BROADCAST do
//     snapshot completo. Todos renderizam o snapshot oficial.
//   • Sync: quando alguém entra/reconecta, host re-emite o snapshot ("welcome").
//
// Protocolo de fio (eventos no Transport):
//   intent   {intent}            cliente → host  (uma intenção a aplicar)
//   snapshot {rev, state}        host → todos    (estado oficial; rev cresce)
//   hello    {playerId}          cliente → host  (entrei/reconectei, me sincroniza)
//   bye      {}                  host → todos    (sala encerrada; ex.: host saiu)
//
// Reconexão: a identidade (playerId) vem do ticket (localStorage), então ao
// reabrir a aba o cliente reanuncia o MESMO id; o host o reconhece e reenvia o
// snapshot atual — a pessoa retoma de onde estava.

import type {
  ConnState,
  PresenceMeta,
  RoomEvent,
  Transport,
  TransportHandlers,
} from "./transport";

/** Contexto que o reduce recebe junto da intenção. */
export interface ReduceCtx {
  /** quem emitiu a intenção. */
  from: string;
  /** presentes no momento (host decide com base em quem está online). */
  members: PresenceMeta[];
  /** o próprio host (id). */
  hostId: string;
}

/** Resultado público que o RoomClient expõe pra UI/hook a cada mudança. */
export interface RoomView<S> {
  conn: ConnState;
  /** sou o host autoritativo desta sala? */
  isHost: boolean;
  /** minha identidade. */
  me: PresenceMeta;
  /** presentes (ordenados por joinedAt). */
  members: PresenceMeta[];
  /** estado oficial atual (o snapshot do host). null até o 1º snapshot. */
  state: S | null;
  /** revisão do snapshot (cresce a cada broadcast; ignora snapshot antigo). */
  rev: number;
  /** sala encerrada (host saiu / bye). */
  ended: boolean;
}

export interface RoomCallbacks<S> {
  /** chamado sempre que a RoomView muda (re-render). */
  onView(view: RoomView<S>): void;
}

export interface RoomClientOpts<S, I> {
  transport: Transport;
  room: string;
  me: PresenceMeta;
  /** estado inicial que o HOST cria ao abrir a sala. */
  initialState: S;
  /** regra do jogo: aplica uma intenção ao estado (roda SÓ no host). */
  reduce(state: S, intent: I, ctx: ReduceCtx): S;
}

type Wire<S, I> =
  | { w: "intent"; intent: I }
  | { w: "snapshot"; rev: number; state: S }
  | { w: "hello"; playerId: string }
  | { w: "bye" };

export class RoomClient<S, I> {
  private tx: Transport;
  private room: string;
  private me: PresenceMeta;
  private reduce: (state: S, intent: I, ctx: ReduceCtx) => S;

  private members: PresenceMeta[] = [];
  private conn: ConnState = "idle";
  private ended = false;

  // estado oficial + revisão (no host é a fonte; no cliente é a cópia recebida).
  private state: S;
  private rev = 0;

  private cbs: RoomCallbacks<S> | null = null;

  constructor(opts: RoomClientOpts<S, I>) {
    this.tx = opts.transport;
    this.room = opts.room;
    this.me = opts.me;
    this.reduce = opts.reduce;
    this.state = opts.initialState;
  }

  /** Conecta e começa a sincronizar. */
  async start(cbs: RoomCallbacks<S>): Promise<void> {
    this.cbs = cbs;
    const handlers: TransportHandlers = {
      onEvent: (ev) => this.onEvent(ev),
      onPresence: (m) => this.onPresence(m),
      onConn: (s) => this.onConn(s),
    };
    await this.tx.join(this.room, this.me, handlers);
    // Anuncia que cheguei; o host responde com o snapshot atual.
    this.post({ w: "hello", playerId: this.me.playerId });
    // Se EU sou o host, já publico o estado inicial pra quem entrar ver algo.
    if (this.isHost()) this.broadcast();
  }

  /** Encerra a conexão. Se for o host, avisa a sala (bye). */
  async stop(): Promise<void> {
    if (this.isHost()) this.post({ w: "bye" });
    await this.tx.leave();
  }

  /** UI dispara uma intenção. No host aplica direto; no cliente, manda pro host. */
  dispatch(intent: I): void {
    if (this.ended) return;
    if (this.isHost()) {
      this.applyAsHost(intent, this.me.playerId);
    } else {
      this.post({ w: "intent", intent });
    }
  }

  /** Host substitui o estado inteiro (ex.: tick de timer/timeline) e rebroadcast. */
  setHostState(next: S): void {
    if (!this.isHost()) return;
    this.state = next;
    this.broadcast();
  }

  view(): RoomView<S> {
    return {
      conn: this.conn,
      isHost: this.isHost(),
      me: this.me,
      members: this.members,
      state: this.rev > 0 || this.isHost() ? this.state : null,
      rev: this.rev,
      ended: this.ended,
    };
  }

  // ── host ──

  private isHost(): boolean {
    return this.me.isHost;
  }

  private applyAsHost(intent: I, from: string): void {
    const ctx: ReduceCtx = { from, members: this.members, hostId: this.me.playerId };
    this.state = this.reduce(this.state, intent, ctx);
    this.broadcast();
  }

  private broadcast(): void {
    this.rev += 1;
    this.post({ w: "snapshot", rev: this.rev, state: this.state });
    this.emit(); // host também re-renderiza com o próprio estado novo
  }

  // ── eventos recebidos ──

  private onEvent(ev: RoomEvent): void {
    const m = ev.payload as Wire<S, I>;
    switch (m.w) {
      case "intent":
        // só o host processa intenções.
        if (this.isHost()) this.applyAsHost(m.intent, ev.from);
        break;
      case "snapshot":
        // cliente adota o snapshot se for mais novo (ignora chegada fora de ordem).
        if (!this.isHost() && m.rev > this.rev) {
          this.rev = m.rev;
          this.state = m.state;
          this.emit();
        }
        break;
      case "hello":
        // host reenvia o snapshot atual pra quem (re)entrou.
        if (this.isHost() && ev.from !== this.me.playerId) {
          this.post({ w: "snapshot", rev: this.rev, state: this.state });
        }
        break;
      case "bye":
        // host encerrou a sala (§5.1: "host saiu — sala encerrada").
        if (!this.isHost()) {
          this.ended = true;
          this.emit();
        }
        break;
    }
  }

  private onPresence(members: PresenceMeta[]): void {
    this.members = members;
    // Host re-sincroniza quem está na sala sempre que a presença muda
    // (garante que um reconectado receba estado mesmo se o "hello" se perdeu).
    if (this.isHost() && this.rev > 0) {
      this.post({ w: "snapshot", rev: this.rev, state: this.state });
    }
    this.emit();
  }

  private onConn(s: ConnState): void {
    this.conn = s;
    // ao reconectar, reanuncia presença (já feito pelo transport) e pede sync.
    if (s === "joined" && !this.isHost()) this.post({ w: "hello", playerId: this.me.playerId });
    this.emit();
  }

  // ── infra ──

  private post(m: Wire<S, I>): void {
    this.tx.send("room", m);
  }

  private emit(): void {
    this.cbs?.onView(this.view());
  }
}

// ============================================================
// useRoom — ponte React ⇄ RoomClient
// ============================================================
// Hook genérico: cria o RoomClient (com o transporte disponível), conecta ao
// entrar e desconecta ao sair, e expõe a RoomView + dispatch pra UI. O jogo
// pluga as regras via `reduce` e o tipo do estado/intenção.
//
// A identidade vem do ticket (localStorage) → reconexão por F5/reabrir aba
// reusa o MESMO playerId, e o host reconhece quem voltou.

import { useCallback, useEffect, useRef, useState } from "react";
import { createTransport } from "./index";
import { RoomClient, type ReduceCtx, type RoomView } from "./roomClient";
import { identityFor } from "./ticket";
import type { PresenceMeta } from "./transport";

export interface UseRoomOpts<S, I> {
  /** código da sala (ex.: "GOLD-4F2A"). null/"" = não conecta. */
  room: string | null;
  /** sou o criador (host autoritativo)? */
  isHost: boolean;
  /** nick a usar (sobrescreve o do ticket). */
  nick: string;
  /** estado inicial (só o host usa de fato; clientes recebem snapshot). */
  initialState: S;
  /** regra do jogo (roda no host). DEVE ser estável (useCallback) ou memoizada. */
  reduce: (state: S, intent: I, ctx: ReduceCtx) => S;
}

export interface UseRoom<S, I> {
  view: RoomView<S> | null;
  dispatch: (intent: I) => void;
  /** host: substitui o estado inteiro e rebroadcast (timers/ticks). */
  setHostState: (next: S) => void;
  /** desconecta manualmente (ex.: voltar pro início). */
  leave: () => void;
}

export function useRoom<S, I>(opts: UseRoomOpts<S, I>): UseRoom<S, I> {
  const { room, isHost, nick, initialState, reduce } = opts;
  const [view, setView] = useState<RoomView<S> | null>(null);
  const clientRef = useRef<RoomClient<S, I> | null>(null);

  // mantém o reduce/initialState mais recentes sem recriar a sala a cada render.
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const initialRef = useRef(initialState);

  useEffect(() => {
    if (!room) {
      setView(null);
      return;
    }
    let stopped = false;
    const id = identityFor(room, nick);
    const me: PresenceMeta = {
      playerId: id.playerId,
      nick: id.nick || nick || "Você",
      isHost,
      joinedAt: Date.now(),
    };
    const client = new RoomClient<S, I>({
      transport: createTransport(),
      room,
      me,
      initialState: initialRef.current,
      reduce: (s, i, ctx) => reduceRef.current(s, i, ctx),
    });
    clientRef.current = client;

    client
      .start({ onView: (v) => { if (!stopped) setView(v); } })
      .catch((err) => {
        console.error("[useRoom] falha ao conectar:", err);
        if (!stopped) setView((prev) => prev);
      });

    return () => {
      stopped = true;
      client.stop();
      clientRef.current = null;
    };
    // recria só quando muda a sala/papel/nick — não a cada render do reduce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, isHost, nick]);

  const dispatch = useCallback((intent: I) => clientRef.current?.dispatch(intent), []);
  const setHostState = useCallback((next: S) => clientRef.current?.setHostState(next), []);
  const leave = useCallback(() => {
    clientRef.current?.stop();
    clientRef.current = null;
    setView(null);
  }, []);

  return { view, dispatch, setHostState, leave };
}

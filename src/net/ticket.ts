// ============================================================
// TICKET de reconexão (localStorage)
// ============================================================
// §5.1 do design: "re-entrar por ticket". Guardamos { sala, playerId, nick } no
// localStorage. Ao reabrir o link da sala, o jogo reconhece "você é o João que
// caiu" e devolve a vaga — mesma identidade (playerId), nick e (depois) posição
// no bracket. É o que permite F5 / fechar-e-reabrir sem perder a vaga.
//
// O playerId é um id estável gerado UMA vez por (browser × sala) e reusado em
// toda reconexão — é assim que o host sabe que é a mesma pessoa, não um novato.

const TICKET_PREFIX = "w60_ticket:"; // + ROOM (uppercase)
const NICK_KEY = "w60_tourney_nick"; // mesmo do LobbyScreen (último nick lembrado)

export interface Ticket {
  room: string;
  playerId: string;
  nick: string;
  /** ms epoch da última vez que esse ticket foi usado (limpeza futura). */
  savedAt: number;
}

/** Gera um playerId estável e curto. Sem Math.random no escopo de jogo, mas o
 * ticket é puramente local (não sincronizado), então um id aleatório aqui é ok
 * e NÃO afeta determinismo do torneio (que vem da seed da sala). */
export function newPlayerId(): string {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `p_${rnd}`;
}

function keyFor(room: string): string {
  return TICKET_PREFIX + room.toUpperCase();
}

/** Lê o ticket salvo pra uma sala (ou null). */
export function loadTicket(room: string): Ticket | null {
  try {
    const raw = localStorage.getItem(keyFor(room));
    if (!raw) return null;
    const t = JSON.parse(raw) as Ticket;
    if (t && t.room && t.playerId && typeof t.nick === "string") return t;
  } catch {
    /* localStorage indisponível / json inválido */
  }
  return null;
}

/** Salva/atualiza o ticket de uma sala (e o "último nick" global). */
export function saveTicket(t: Omit<Ticket, "savedAt">): Ticket {
  const full: Ticket = { ...t, savedAt: Date.now() };
  try {
    localStorage.setItem(keyFor(t.room), JSON.stringify(full));
    if (t.nick) localStorage.setItem(NICK_KEY, t.nick);
  } catch {
    /* ignora */
  }
  return full;
}

/** Apaga o ticket de uma sala (saída definitiva / sala encerrada). */
export function clearTicket(room: string): void {
  try {
    localStorage.removeItem(keyFor(room));
  } catch {
    /* ignora */
  }
}

/**
 * Obtém (ou cria) a identidade pra entrar numa sala. Se já existe ticket dessa
 * sala, REUSA o playerId (= reconexão); senão cria um novo. O nick informado
 * (se houver) sobrescreve o salvo.
 */
export function identityFor(room: string, nick?: string): Ticket {
  const existing = loadTicket(room);
  const playerId = existing?.playerId ?? newPlayerId();
  const finalNick = (nick ?? existing?.nick ?? lastNick() ?? "").trim();
  return saveTicket({ room, playerId, nick: finalNick });
}

/** Último nick lembrado globalmente (mesmo do LobbyScreen). */
export function lastNick(): string {
  try {
    return localStorage.getItem(NICK_KEY) || "";
  } catch {
    return "";
  }
}

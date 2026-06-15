// ============================================================
// PRNG SEMEADO (mulberry32)
// ============================================================
// O modo offline/online precisa de aleatoriedade REPRODUTÍVEL: dada a mesma
// seed, o draft dos bots, o sorteio do bracket e as simulações saem iguais em
// qualquer navegador. Isso é o que torna o torneio "justo e sincronizável" sem
// um servidor — o host transmite só a seed e todos recriam o mesmo torneio.
//
// mulberry32: gerador rápido, ~5 linhas, distribuição boa o bastante pra jogo.
// NÃO é criptográfico (não precisa ser). Determinístico por construção.

/** Cria um gerador a partir de uma seed inteira. Retorna uma função () => [0,1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uma fonte de aleatoriedade semeada, com helpers prontos pro jogo. */
export interface Rng {
  /** próximo float em [0,1). */
  next(): number;
  /** inteiro em [0,n). */
  int(n: number): number;
  /** elemento aleatório de um array. */
  pick<T>(arr: T[]): T;
  /** cópia embaralhada (Fisher-Yates) — não muta o original. */
  shuffle<T>(arr: T[]): T[];
  /** true com probabilidade p. */
  chance(p: number): boolean;
}

/** Constrói um Rng a partir de uma seed. */
export function makeRng(seed: number): Rng {
  const r = mulberry32(seed);
  const int = (n: number) => Math.floor(r() * n);
  return {
    next: r,
    int,
    pick: <T>(arr: T[]): T => arr[int(arr.length)],
    shuffle: <T>(arr: T[]): T[] => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = int(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    chance: (p: number) => r() < p,
  };
}

/** Gera uma seed legível (inteiro) a partir de um código de sala tipo "GOLD-4F2A". */
export function seedFromCode(code: string): number {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < code.length; i++) {
    h ^= code.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

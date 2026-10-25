/**
 * Seeded pseudo-random generator for the whole simulation (CLAUDE.md rule 2: no Math.random).
 * Algorithm: sfc32 seeded through cyrb128. Fast, 128-bit state, good statistical quality,
 * and the state is four plain numbers, so it serializes into a save game.
 */

export type RngState = readonly [number, number, number, number]

/** Hashes any string into four 32-bit words to seed sfc32. */
function cyrb128(text: string): [number, number, number, number] {
  let h1 = 1779033703
  let h2 = 3144134277
  let h3 = 1013904242
  let h4 = 2773480762
  for (let i = 0; i < text.length; i++) {
    const k = text.charCodeAt(i)
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)
  h1 ^= h2 ^ h3 ^ h4
  h2 ^= h1
  h3 ^= h1
  h4 ^= h1
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0]
}

export class Rng {
  private a: number
  private b: number
  private c: number
  private d: number

  constructor(state: RngState) {
    ;[this.a, this.b, this.c, this.d] = state
  }

  static fromSeed(seed: string | number): Rng {
    const rng = new Rng(cyrb128(String(seed)))
    // Discard the first outputs: sfc32 needs a few rounds to mix a weak seed.
    for (let i = 0; i < 12; i++) rng.next()
    return rng
  }

  getState(): RngState {
    return [this.a, this.b, this.c, this.d]
  }

  /** Uniform float in [0, 1). */
  next(): number {
    this.a >>>= 0
    this.b >>>= 0
    this.c >>>= 0
    this.d >>>= 0
    let t = (this.a + this.b) | 0
    this.a = this.b ^ (this.b >>> 9)
    this.b = (this.c + (this.c << 3)) | 0
    this.c = (this.c << 21) | (this.c >>> 11)
    this.d = (this.d + 1) | 0
    t = (t + this.d) | 0
    this.c = (this.c + t) | 0
    return (t >>> 0) / 4294967296
  }

  /** Uniform integer in [min, max], both inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1))
  }

  float(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  chance(probability: number): boolean {
    return this.next() < probability
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Rng.pick: empty list')
    return items[Math.floor(this.next() * items.length)] as T
  }

  /** Picks by relative weights; weights need not sum to 1. */
  weighted<T>(items: readonly (readonly [T, number])[]): T {
    const total = items.reduce((sum, [, w]) => sum + w, 0)
    let roll = this.next() * total
    for (const [item, w] of items) {
      roll -= w
      if (roll < 0) return item
    }
    const last = items[items.length - 1]
    if (!last) throw new Error('Rng.weighted: empty list')
    return last[0]
  }

  /** Normal distribution (Box–Muller). */
  normal(mean: number, sd: number): number {
    const u = 1 - this.next()
    const v = this.next()
    return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }

  /** Poisson-distributed integer (Knuth); fine for the small means of football scores. */
  poisson(mean: number): number {
    const limit = Math.exp(-mean)
    let k = 0
    let p = this.next()
    while (p > limit) {
      k++
      p *= this.next()
    }
    return k
  }

  /** Independent child stream, so adding draws in one subsystem never shifts another. */
  fork(label: string): Rng {
    return Rng.fromSeed(`${this.a}:${this.b}:${this.c}:${this.d}:${label}`)
  }
}

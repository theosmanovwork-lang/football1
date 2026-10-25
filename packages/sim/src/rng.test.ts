import { describe, expect, it } from 'vitest'
import { Rng } from './rng'

describe('Rng', () => {
  it('repeats the same sequence for the same seed', () => {
    const a = Rng.fromSeed('north-river')
    const b = Rng.fromSeed('north-river')
    expect(Array.from({ length: 50 }, () => a.next())).toEqual(
      Array.from({ length: 50 }, () => b.next()),
    )
  })

  it('differs between seeds', () => {
    expect(Rng.fromSeed(1).next()).not.toBe(Rng.fromSeed(2).next())
  })

  it('resumes from a saved state', () => {
    const rng = Rng.fromSeed('save')
    rng.next()
    const copy = new Rng(rng.getState())
    expect(copy.next()).toBe(rng.next())
  })

  it('keeps int() within bounds and covers them', () => {
    const rng = Rng.fromSeed('bounds')
    const seen = new Set<number>()
    for (let i = 0; i < 2000; i++) {
      const v = rng.int(1, 20)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(20)
      seen.add(v)
    }
    expect(seen.size).toBe(20)
  })

  it('draws Poisson values with the requested mean', () => {
    const rng = Rng.fromSeed('poisson')
    let sum = 0
    const n = 20000
    for (let i = 0; i < n; i++) sum += rng.poisson(1.4)
    expect(sum / n).toBeCloseTo(1.4, 1)
  })

  it('forks independent streams deterministically', () => {
    const x = Rng.fromSeed('root').fork('league-1').next()
    const y = Rng.fromSeed('root').fork('league-1').next()
    const z = Rng.fromSeed('root').fork('league-2').next()
    expect(x).toBe(y)
    expect(x).not.toBe(z)
  })
})

import { describe, expect, it } from 'vitest'
import { doubleRoundRobin } from './schedule'

const clubs = Array.from({ length: 20 }, (_, i) => `k${i + 1}`)
const fixtures = doubleRoundRobin(clubs)

describe('doubleRoundRobin', () => {
  it('has 38 rounds of 10 matches', () => {
    expect(fixtures).toHaveLength(380)
    for (let round = 1; round <= 38; round++) {
      expect(fixtures.filter((f) => f.round === round)).toHaveLength(10)
    }
  })

  it('lets every club play exactly once per round', () => {
    for (let round = 1; round <= 38; round++) {
      const teams = fixtures.filter((f) => f.round === round).flatMap((f) => [f.homeId, f.awayId])
      expect(new Set(teams).size).toBe(20)
    }
  })

  it('pairs every two clubs once at home and once away', () => {
    const pairs = new Set(fixtures.map((f) => `${f.homeId}>${f.awayId}`))
    expect(pairs.size).toBe(380)
    for (const a of clubs) {
      for (const b of clubs) {
        if (a !== b) expect(pairs.has(`${a}>${b}`)).toBe(true)
      }
    }
  })

  it('gives each club 19 home matches', () => {
    for (const club of clubs) expect(fixtures.filter((f) => f.homeId === club)).toHaveLength(19)
  })
})

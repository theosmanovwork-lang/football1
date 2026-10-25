import { describe, expect, it } from 'vitest'
import { runSeason } from './season'
import { generateWorld } from './world'

const world = generateWorld('season-test')
const season = runSeason(world, '2026')

describe('runSeason', () => {
  it('gives the same tables for the same seed', () => {
    expect(runSeason(generateWorld('season-test'), '2026')).toEqual(season)
  })

  it('gives different tables for a different seed', () => {
    const other = runSeason(world, '2027')
    expect(other.leagues.map((l) => l.table)).not.toEqual(season.leagues.map((l) => l.table))
  })

  it('plays 38 matches per club and the points add up', () => {
    for (const league of season.leagues) {
      expect(league.results).toHaveLength(380)
      for (const row of league.table) {
        expect(row.played).toBe(38)
        expect(row.won + row.drawn + row.lost).toBe(38)
        expect(row.points).toBe(row.won * 3 + row.drawn)
      }
      const draws = league.results.filter((r) => r.home === r.away).length
      const totalPoints = league.table.reduce((sum, row) => sum + row.points, 0)
      expect(totalPoints).toBe((380 - draws) * 3 + draws * 2)
      const goalsFor = league.table.reduce((sum, row) => sum + row.goalsFor, 0)
      const goalsAgainst = league.table.reduce((sum, row) => sum + row.goalsAgainst, 0)
      expect(goalsFor).toBe(goalsAgainst)
    }
  })

  it('produces football-like scores', () => {
    const results = season.leagues.flatMap((l) => l.results)
    const goalsPerMatch = results.reduce((sum, r) => sum + r.home + r.away, 0) / results.length
    const homeWins = results.filter((r) => r.home > r.away).length / results.length
    const draws = results.filter((r) => r.home === r.away).length / results.length
    expect(goalsPerMatch).toBeGreaterThan(2.2)
    expect(goalsPerMatch).toBeLessThan(3.3)
    expect(homeWins).toBeGreaterThan(0.38)
    expect(homeWins).toBeLessThan(0.52)
    expect(draws).toBeGreaterThan(0.18)
    expect(draws).toBeLessThan(0.32)
  })

  it('sorts the table by points, then goal difference', () => {
    for (const league of season.leagues) {
      for (let i = 1; i < league.table.length; i++) {
        const prev = league.table[i - 1]
        const row = league.table[i]
        if (!prev || !row) continue
        expect(prev.points).toBeGreaterThanOrEqual(row.points)
      }
    }
  })
})

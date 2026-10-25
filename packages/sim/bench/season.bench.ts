import { expect, test } from 'vitest'
import { generateWorld, runSeason, type World } from '../src/index'
import { formatMeasurement, measure } from './measure'

// T001 step 3: world generation and a full five-league season, average of 5 runs.
// Target: the season in under 5 s on a mid-range laptop.
test('world generation and full season', () => {
  let world: World | undefined
  const generation = measure('generateWorld (5 leagues, 5 000 players)', () => {
    world = generateWorld('bench')
  })
  if (!world) throw new Error('world not generated')
  const generated = world
  let seasonIndex = 0
  const season = measure('runSeason (5 leagues × 380 matches)', () => {
    runSeason(generated, String(++seasonIndex))
  })
  console.log(formatMeasurement(generation))
  console.log(formatMeasurement(season))

  const sample = runSeason(generated, 'stats')
  const results = sample.leagues.flatMap((l) => l.results)
  const goals = results.reduce((sum, r) => sum + r.home + r.away, 0) / results.length
  const homeWins = results.filter((r) => r.home > r.away).length / results.length
  const draws = results.filter((r) => r.home === r.away).length / results.length
  console.log(
    `stats: ${goals.toFixed(2)} goals per match, home wins ${(homeWins * 100).toFixed(0)}%, draws ${(draws * 100).toFixed(0)}%`,
  )
  for (const league of sample.leagues) {
    const levels = new Map(generated.clubs.map((c) => [c.id, c.level]))
    const champion = league.table[0]
    const bottom = league.table[league.table.length - 1]
    if (!champion || !bottom) continue
    const ranks = [...generated.clubs.filter((c) => c.leagueId === league.leagueId)].sort(
      (a, b) => b.level - a.level,
    )
    const rankOf = (id: string): number => ranks.findIndex((c) => c.id === id) + 1
    console.log(
      `${league.leagueId}: champion ${champion.points} pts (strength rank ${rankOf(champion.clubId)}, level ${levels.get(champion.clubId)}), last ${bottom.points} pts (rank ${rankOf(bottom.clubId)})`,
    )
  }
  expect(season.averageMs).toBeLessThan(5000)
})

import { expect, test } from '@playwright/test'

/** The part of the renderer's `window.__fmSim` hook this test uses. */
interface SimHook {
  newWorld(seed: string): Promise<{ players: number; clubs: number; ms: number }>
  playSeason(seed: string): Promise<{ matches: number; ms: number }>
  tables(): Promise<{ rows: unknown[] }[]>
  players(): Promise<unknown[]>
}

test('simulation worker generates a world and plays a season off the UI thread', async ({
  page,
}) => {
  await page.goto('/')
  const result = await page.evaluate(async () => {
    const hook = (window as unknown as { __fmSim?: () => SimHook }).__fmSim
    if (!hook) throw new Error('simulation hook missing')
    const sim = hook()
    const world = await sim.newWorld('e2e')
    const season = await sim.playSeason('2026')
    const tables = await sim.tables()
    const players = await sim.players()
    return {
      world,
      season,
      leagues: tables.length,
      firstTable: tables[0]?.rows.length,
      players: players.length,
    }
  })
  expect(result.world.players).toBe(5000)
  expect(result.world.clubs).toBe(100)
  expect(result.season.matches).toBe(1900)
  expect(result.leagues).toBe(5)
  expect(result.firstTable).toBe(20)
  expect(result.players).toBe(5000)
  console.log(
    `browser worker: world ${result.world.ms.toFixed(1)} ms, season ${result.season.ms.toFixed(1)} ms`,
  )
  expect(result.season.ms).toBeLessThan(5000)
})

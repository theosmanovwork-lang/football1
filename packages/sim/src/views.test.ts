import { describe, expect, it } from 'vitest'
import { runSeason } from './season'
import { leagueTables, playerRows } from './views'
import { generateWorld } from './world'

const world = generateWorld('views')

describe('views', () => {
  it('flattens every player into a renderable row', () => {
    const rows = playerRows(world)
    expect(rows).toHaveLength(world.players.length)
    const agent = rows.find((r) => r.club === 'Свободный агент')
    expect(agent?.league).toBe('—')
    expect(rows.every((r) => r.overall >= 1 && r.overall <= 20 && r.word.length > 0)).toBe(true)
  })

  it('names clubs and numbers table positions', () => {
    const tables = leagueTables(world, runSeason(world, '1'))
    expect(tables).toHaveLength(5)
    const first = tables[0]
    expect(first?.rows[0]?.position).toBe(1)
    expect(first?.rows[19]?.position).toBe(20)
    expect(first?.rows.every((r) => !r.club.startsWith('l'))).toBe(true)
  })
})

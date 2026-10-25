import { describe, expect, it } from 'vitest'
import { overall, dossierWord } from './ratings'
import { generateWorld } from './world'

const world = generateWorld('test-world')

describe('generateWorld', () => {
  it('builds 5 leagues of 20 clubs with 25–30 players each', () => {
    expect(world.leagues).toHaveLength(5)
    for (const league of world.leagues) expect(league.clubIds).toHaveLength(20)
    for (const club of world.clubs) {
      const size = world.players.filter((p) => p.clubId === club.id).length
      expect(size).toBeGreaterThanOrEqual(25)
      expect(size).toBeLessThanOrEqual(30)
    }
  })

  it('fills up to about 5 000 players with free agents', () => {
    expect(world.players).toHaveLength(5000)
    expect(world.players.some((p) => p.clubId === null)).toBe(true)
  })

  it('keeps every attribute an integer from 1 to 20', () => {
    for (const player of world.players) {
      for (const value of Object.values(player.attributes)) {
        expect(Number.isInteger(value)).toBe(true)
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(20)
      }
    }
  })

  it('gives every club at least two goalkeepers and plausible ages', () => {
    for (const club of world.clubs) {
      const squad = world.players.filter((p) => p.clubId === club.id)
      expect(squad.filter((p) => p.positions[0] === 'GK').length).toBeGreaterThanOrEqual(2)
    }
    for (const player of world.players) {
      expect(player.age).toBeGreaterThanOrEqual(16)
      expect(player.age).toBeLessThanOrEqual(37)
    }
  })

  it('uses unique ids and unique club names within a league', () => {
    expect(new Set(world.players.map((p) => p.id)).size).toBe(world.players.length)
    for (const league of world.leagues) {
      const names = world.clubs.filter((c) => c.leagueId === league.id).map((c) => c.shortName)
      expect(new Set(names).size).toBe(names.length)
    }
  })

  it('is deterministic for a seed and different across seeds', () => {
    expect(generateWorld('test-world')).toEqual(world)
    expect(generateWorld('another-world').players[0]).not.toEqual(world.players[0])
  })

  it('maps overall levels to dossier words', () => {
    const words = new Set(world.players.map((p) => dossierWord(overall(p))))
    expect(words.has('Хорошо')).toBe(true)
    expect(dossierWord(20)).toBe('Элитный уровень')
    expect(dossierWord(1)).toBe('Слабо')
  })
})

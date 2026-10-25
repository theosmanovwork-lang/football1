/// <reference lib="webworker" />
import * as Comlink from 'comlink'
import {
  generateWorld,
  leagueTables,
  playerRows,
  runSeason,
  type LeagueTableView,
  type PlayerRow,
  type SeasonResult,
  type World,
} from '@fm/sim'

/**
 * The simulation core runs here, off the UI thread (CLAUDE.md: core in a Web Worker via Comlink).
 * The world stays inside the worker; the UI receives only flat views.
 */

let world: World | null = null
let season: SeasonResult | null = null

function requireWorld(): World {
  if (!world) throw new Error('No world: call newWorld() first')
  return world
}

export interface WorldSummary {
  seed: string
  leagues: number
  clubs: number
  players: number
  ms: number
}

export interface SeasonSummary {
  seasonSeed: string
  matches: number
  ms: number
}

const api = {
  newWorld(seed: string): WorldSummary {
    const start = performance.now()
    world = generateWorld(seed)
    season = null
    return {
      seed,
      leagues: world.leagues.length,
      clubs: world.clubs.length,
      players: world.players.length,
      ms: performance.now() - start,
    }
  },

  playSeason(seasonSeed: string): SeasonSummary {
    const current = requireWorld()
    const start = performance.now()
    season = runSeason(current, seasonSeed)
    return {
      seasonSeed,
      matches: season.leagues.reduce((sum, l) => sum + l.results.length, 0),
      ms: performance.now() - start,
    }
  },

  players(): PlayerRow[] {
    return playerRows(requireWorld())
  },

  tables(): LeagueTableView[] {
    if (!season) return []
    return leagueTables(requireWorld(), season)
  },
}

export type SimApi = typeof api

Comlink.expose(api)

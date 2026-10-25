/**
 * Simulation core. Pure TypeScript: no React, DOM, Electron or Node APIs.
 */

export const SIM_VERSION = '0.1.0'

export interface CoreInfo {
  version: string
}

export function getCoreInfo(): CoreInfo {
  return { version: SIM_VERSION }
}

export * from './types'
export { Rng, type RngState } from './rng'
export { generateWorld, DEFAULT_WORLD_OPTIONS, type WorldOptions } from './world'
export { abilityAt, overall, dossierWord, type DossierWord } from './ratings'
export { doubleRoundRobin, type Fixture } from './schedule'
export { teamStrength, playMatch, type TeamStrength, type Score } from './match'
export {
  runSeason,
  buildTable,
  type MatchResult,
  type StandingRow,
  type LeagueSeason,
  type SeasonResult,
} from './season'
export {
  playerRows,
  leagueTables,
  type PlayerRow,
  type TableRowView,
  type LeagueTableView,
} from './views'

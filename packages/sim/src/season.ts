import { playMatch, teamStrength, type Score, type TeamStrength } from './match'
import { Rng } from './rng'
import { doubleRoundRobin, type Fixture } from './schedule'
import type { Player, World } from './types'

export interface MatchResult extends Fixture, Score {}

export interface StandingRow {
  clubId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export interface LeagueSeason {
  leagueId: string
  results: MatchResult[]
  table: StandingRow[]
}

export interface SeasonResult {
  seasonSeed: string
  leagues: LeagueSeason[]
}

function emptyRow(clubId: string): StandingRow {
  return { clubId, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
}

function record(row: StandingRow, scored: number, conceded: number): void {
  row.played++
  row.goalsFor += scored
  row.goalsAgainst += conceded
  if (scored > conceded) {
    row.won++
    row.points += 3
  } else if (scored === conceded) {
    row.drawn++
    row.points += 1
  } else {
    row.lost++
  }
}

/** Points, then goal difference, then goals scored, then club id for a stable order. */
export function sortTable(rows: StandingRow[]): StandingRow[] {
  return rows.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor ||
      a.clubId.localeCompare(b.clubId),
  )
}

export function buildTable(
  clubIds: readonly string[],
  results: readonly MatchResult[],
): StandingRow[] {
  const rows = new Map(clubIds.map((id) => [id, emptyRow(id)]))
  for (const r of results) {
    const home = rows.get(r.homeId)
    const away = rows.get(r.awayId)
    if (!home || !away) throw new Error(`Unknown club in result ${r.homeId}–${r.awayId}`)
    record(home, r.home, r.away)
    record(away, r.away, r.home)
  }
  return sortTable([...rows.values()])
}

/**
 * Plays a full season of every league. Deterministic: the same world and season seed
 * always give the same tables; each league has its own random stream.
 */
export function runSeason(world: World, seasonSeed = '1'): SeasonResult {
  const root = Rng.fromSeed(`season:${world.seed}:${seasonSeed}`)
  const squads = new Map<string, Player[]>()
  for (const player of world.players) {
    if (!player.clubId) continue
    const squad = squads.get(player.clubId)
    if (squad) squad.push(player)
    else squads.set(player.clubId, [player])
  }
  const strength = new Map<string, TeamStrength>()
  for (const [clubId, squad] of squads) strength.set(clubId, teamStrength(squad))

  const leagues = world.leagues.map((league): LeagueSeason => {
    const rng = root.fork(league.id)
    const results = doubleRoundRobin(league.clubIds).map((fixture): MatchResult => {
      const home = strength.get(fixture.homeId)
      const away = strength.get(fixture.awayId)
      if (!home || !away) throw new Error(`No squad for ${fixture.homeId} or ${fixture.awayId}`)
      return { ...fixture, ...playMatch(rng, home, away) }
    })
    return { leagueId: league.id, results, table: buildTable(league.clubIds, results) }
  })

  return { seasonSeed, leagues }
}

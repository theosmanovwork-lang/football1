import { dossierWord, overall, type DossierWord } from './ratings'
import type { SeasonResult } from './season'
import type { Position, World } from './types'

/** Flat, serializable rows the UI can render as-is (CLAUDE.md rule 3: no logic in the UI). */
export interface PlayerRow {
  id: string
  name: string
  age: number
  position: Position
  club: string
  league: string
  nationality: string
  /** 1–20; shown only when the "raw numbers" setting is on (CLAUDE.md rule 6). */
  overall: number
  word: DossierWord
}

export function playerRows(world: World): PlayerRow[] {
  const clubs = new Map(world.clubs.map((c) => [c.id, c]))
  const leagues = new Map(world.leagues.map((l) => [l.id, l.name]))
  const countries = new Map(world.countries.map((c) => [c.id, c.name]))
  return world.players.map((p) => {
    const club = p.clubId ? clubs.get(p.clubId) : undefined
    const value = overall(p)
    return {
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      age: p.age,
      position: p.positions[0] ?? 'CM',
      club: club?.name ?? 'Свободный агент',
      league: club ? (leagues.get(club.leagueId) ?? '') : '—',
      nationality: countries.get(p.nationality) ?? p.nationality,
      overall: value,
      word: dossierWord(value),
    }
  })
}

export interface TableRowView {
  position: number
  club: string
  played: number
  won: number
  drawn: number
  lost: number
  goalDifference: number
  points: number
}

export interface LeagueTableView {
  leagueId: string
  league: string
  rows: TableRowView[]
}

export function leagueTables(world: World, season: SeasonResult): LeagueTableView[] {
  const clubs = new Map(world.clubs.map((c) => [c.id, c.name]))
  const leagues = new Map(world.leagues.map((l) => [l.id, l.name]))
  return season.leagues.map((league) => ({
    leagueId: league.leagueId,
    league: leagues.get(league.leagueId) ?? league.leagueId,
    rows: league.table.map((row, i) => ({
      position: i + 1,
      club: clubs.get(row.clubId) ?? row.clubId,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalDifference: row.goalsFor - row.goalsAgainst,
      points: row.points,
    })),
  }))
}

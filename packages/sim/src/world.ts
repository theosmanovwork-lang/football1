import { NAME_STYLES, personName, townName, type NameStyle } from './names'
import { POSITION_WEIGHTS } from './ratings'
import { Rng } from './rng'
import {
  ATTRIBUTE_BLOCKS,
  type Attribute,
  type Attributes,
  type Club,
  type Country,
  type League,
  type Player,
  type Position,
  type World,
} from './types'

export interface WorldOptions {
  leagues: number
  clubsPerLeague: number
  squadMin: number
  squadMax: number
  /** Free agents are added until the world has this many players. */
  totalPlayers: number
}

export const DEFAULT_WORLD_OPTIONS: WorldOptions = {
  leagues: 5,
  clubsPerLeague: 20,
  squadMin: 25,
  squadMax: 30,
  totalPlayers: 5000,
}

/** Average club level of each league tier on the 1–20 scale. */
const LEAGUE_LEVEL = [13.5, 13, 12.5, 12, 11.5] as const

/** Core of every squad; the rest of the places are filled at random. */
const SQUAD_CORE: readonly (readonly [Position, number])[] = [
  ['GK', 3],
  ['CB', 4],
  ['FB', 4],
  ['DM', 2],
  ['CM', 3],
  ['AM', 2],
  ['W', 3],
  ['ST', 3],
]

const EXTRA_POSITION_WEIGHTS: readonly (readonly [Position, number])[] = [
  ['CB', 3],
  ['FB', 2],
  ['DM', 1],
  ['CM', 3],
  ['AM', 1],
  ['W', 2],
  ['ST', 2],
]

const SECOND_POSITION: Record<Position, readonly Position[]> = {
  GK: [],
  CB: ['FB', 'DM'],
  FB: ['W', 'CB'],
  DM: ['CM', 'CB'],
  CM: ['DM', 'AM'],
  AM: ['CM', 'W'],
  W: ['AM', 'FB', 'ST'],
  ST: ['W', 'AM'],
}

const OUTFIELD_ATTRIBUTES: readonly Attribute[] = Object.values(ATTRIBUTE_BLOCKS).flat()

function clampAttribute(value: number): number {
  return Math.max(1, Math.min(20, Math.round(value)))
}

/** Age with a peak around 24–28 and a few teenagers and veterans. */
function randomAge(rng: Rng): number {
  return Math.max(16, Math.min(37, Math.round(rng.normal(25.5, 4.2))))
}

/** Youngsters are below their club level, peak-age players at it, veterans slightly below. */
function ageAdjustment(age: number): number {
  if (age <= 19) return -2.5
  if (age <= 22) return -1
  if (age <= 30) return 0.4
  if (age <= 33) return -0.3
  return -1.2
}

function generateAttributes(rng: Rng, level: number, position: Position): Attributes {
  const weights = POSITION_WEIGHTS[position]
  const attributes = {} as Attributes
  for (const attribute of OUTFIELD_ATTRIBUTES) {
    // Attributes the position relies on sit above the player's level, the rest below.
    const emphasis = weights[attribute] ? 1.2 + weights[attribute] * 0.35 : -1.8
    const keeperPenalty = position === 'GK' && !weights[attribute] ? -3 : 0
    attributes[attribute] = clampAttribute(level + emphasis + keeperPenalty + rng.normal(0, 2))
  }
  attributes.goalkeeping =
    position === 'GK'
      ? clampAttribute(level + 3 + rng.normal(0, 1.5))
      : clampAttribute(rng.normal(3, 1.5))
  return attributes
}

function createPlayer(
  rng: Rng,
  id: string,
  style: NameStyle,
  countryId: string,
  clubId: string | null,
  level: number,
  position: Position,
): Player {
  const age = randomAge(rng)
  const playerLevel = level + ageAdjustment(age) + rng.normal(0, 1.6)
  const positions: Position[] = [position]
  const options = SECOND_POSITION[position]
  if (options.length > 0 && rng.chance(0.45)) positions.push(rng.pick(options))
  return {
    id,
    ...personName(rng, style),
    age,
    nationality: countryId,
    positions,
    attributes: generateAttributes(rng, playerLevel, position),
    clubId,
  }
}

/** Builds a fictional world. Same seed and options → identical world (CLAUDE.md rule 2). */
export function generateWorld(seed: string, options: WorldOptions = DEFAULT_WORLD_OPTIONS): World {
  const root = Rng.fromSeed(`world:${seed}`)
  const countries: Country[] = []
  const leagues: League[] = []
  const clubs: Club[] = []
  const players: Player[] = []
  let playerSeq = 0
  const nextPlayerId = (): string => `p${++playerSeq}`

  for (let l = 0; l < options.leagues; l++) {
    const style = NAME_STYLES[l % NAME_STYLES.length] as NameStyle
    const rng = root.fork(`league:${l}`)
    const countryId = `c${l + 1}`
    const leagueId = `l${l + 1}`
    countries.push({ id: countryId, name: style.country })

    const baseLevel = LEAGUE_LEVEL[l] ?? 11
    const usedNames = new Set<string>()
    const clubIds: string[] = []
    for (let c = 0; c < options.clubsPerLeague; c++) {
      let town = townName(rng, style)
      while (usedNames.has(town)) town = townName(rng, style)
      usedNames.add(town)
      const suffix = rng.pick(style.clubSuffix)
      const name = suffix ? (rng.chance(0.5) ? `${town} ${suffix}` : `${suffix} ${town}`) : town
      // Spread clubs from title contenders to relegation candidates around the league level.
      const spread = 3.2 * (1 - (2 * c) / (options.clubsPerLeague - 1))
      const club: Club = {
        id: `${leagueId}-k${c + 1}`,
        name,
        shortName: town,
        leagueId,
        level: Math.round((baseLevel + spread + rng.normal(0, 0.6)) * 10) / 10,
      }
      clubs.push(club)
      clubIds.push(club.id)

      const squadSize = rng.int(options.squadMin, options.squadMax)
      const positions: Position[] = SQUAD_CORE.flatMap(([position, count]) =>
        Array.from({ length: count }, () => position),
      )
      while (positions.length < squadSize) positions.push(rng.weighted(EXTRA_POSITION_WEIGHTS))
      for (const position of positions) {
        players.push(
          createPlayer(rng, nextPlayerId(), style, countryId, club.id, club.level, position),
        )
      }
    }
    leagues.push({ id: leagueId, name: style.league, countryId, tier: l + 1, clubIds })
  }

  const agents = root.fork('free-agents')
  while (players.length < options.totalPlayers) {
    const l = agents.int(0, options.leagues - 1)
    const style = NAME_STYLES[l % NAME_STYLES.length] as NameStyle
    const position = agents.weighted<Position>([['GK', 1], ...EXTRA_POSITION_WEIGHTS])
    players.push(
      createPlayer(agents, nextPlayerId(), style, `c${l + 1}`, null, agents.float(6, 11), position),
    )
  }

  return { seed, countries, leagues, clubs, players }
}

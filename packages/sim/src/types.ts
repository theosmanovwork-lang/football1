/**
 * Prototype world model for T001. T002 replaces it with the full data model
 * (staff, contracts, knowledge, subscriptions); keep everything plain and serializable.
 */

export const ATTRIBUTE_BLOCKS = {
  technical: ['passing', 'firstTouch', 'dribbling', 'finishing', 'tackling', 'heading'],
  tactical: ['positioning', 'decisions', 'offTheBall', 'vision'],
  physical: ['pace', 'stamina', 'strength', 'agility'],
  mental: ['composure', 'workRate', 'determination', 'leadership'],
} as const

export type AttributeBlock = keyof typeof ATTRIBUTE_BLOCKS
export type OutfieldAttribute = (typeof ATTRIBUTE_BLOCKS)[AttributeBlock][number]
export type Attribute = OutfieldAttribute | 'goalkeeping'

/** Every attribute is an integer 1–20 (CLAUDE.md rule 6). */
export type Attributes = Record<Attribute, number>

export const POSITIONS = ['GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'W', 'ST'] as const
export type Position = (typeof POSITIONS)[number]

export interface Country {
  id: string
  name: string
}

export interface League {
  id: string
  name: string
  countryId: string
  /** 1 = strongest league of the world; drives club and player levels. */
  tier: number
  clubIds: string[]
}

export interface Club {
  id: string
  name: string
  shortName: string
  leagueId: string
  /** Club level on the 1–20 scale; squads are generated around it. */
  level: number
}

export interface Player {
  id: string
  firstName: string
  lastName: string
  age: number
  nationality: string
  /** Main position first. */
  positions: Position[]
  attributes: Attributes
  /** Null for free agents. */
  clubId: string | null
}

export interface World {
  seed: string
  countries: Country[]
  leagues: League[]
  clubs: Club[]
  players: Player[]
}

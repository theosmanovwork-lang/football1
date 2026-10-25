import type { Attribute, Player, Position } from './types'

type Weights = Partial<Record<Attribute, number>>

/** What matters at each position; weights are relative. Prototype values, tuned by eye. */
export const POSITION_WEIGHTS: Record<Position, Weights> = {
  GK: { goalkeeping: 6, positioning: 2, decisions: 1.5, composure: 1.5, agility: 1.5 },
  CB: {
    tackling: 3,
    heading: 2.5,
    positioning: 3,
    strength: 2,
    decisions: 1.5,
    composure: 1,
    pace: 1,
  },
  FB: {
    tackling: 2,
    pace: 2.5,
    stamina: 2,
    positioning: 2,
    passing: 1.5,
    workRate: 1.5,
    dribbling: 1,
  },
  DM: {
    tackling: 2.5,
    positioning: 2.5,
    passing: 2,
    decisions: 2,
    stamina: 1.5,
    workRate: 1.5,
    strength: 1,
  },
  CM: {
    passing: 3,
    vision: 2,
    decisions: 2,
    firstTouch: 2,
    stamina: 1.5,
    workRate: 1.5,
    composure: 1,
  },
  AM: {
    passing: 2.5,
    vision: 3,
    firstTouch: 2,
    dribbling: 2,
    offTheBall: 1.5,
    composure: 1.5,
    finishing: 1,
  },
  W: {
    dribbling: 3,
    pace: 3,
    firstTouch: 1.5,
    passing: 1.5,
    offTheBall: 1.5,
    agility: 1.5,
    finishing: 1,
  },
  ST: {
    finishing: 3.5,
    offTheBall: 2.5,
    composure: 2,
    firstTouch: 1.5,
    heading: 1.5,
    pace: 1.5,
    strength: 1,
  },
}

/** Ability at a position on the 1–20 scale (not rounded). */
export function abilityAt(player: Player, position: Position): number {
  const weights = POSITION_WEIGHTS[position]
  let sum = 0
  let total = 0
  for (const [attribute, weight] of Object.entries(weights) as [Attribute, number][]) {
    sum += player.attributes[attribute] * weight
    total += weight
  }
  return sum / total
}

/** Overall level at the main position, rounded to the 1–20 scale. */
export function overall(player: Player): number {
  const main = player.positions[0]
  if (!main) throw new Error(`Player ${player.id} has no position`)
  return Math.round(abilityAt(player, main))
}

export type DossierWord =
  'Элитный уровень' | 'Очень хорошо' | 'Хорошо' | 'Средне' | 'Ниже среднего' | 'Слабо'

/** 1–20 → dossier word (docs/concept.md, scout dossier scale). */
export function dossierWord(value: number): DossierWord {
  if (value >= 18) return 'Элитный уровень'
  if (value >= 15) return 'Очень хорошо'
  if (value >= 12) return 'Хорошо'
  if (value >= 9) return 'Средне'
  if (value >= 6) return 'Ниже среднего'
  return 'Слабо'
}

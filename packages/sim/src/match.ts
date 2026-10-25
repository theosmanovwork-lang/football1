/**
 * TEMPORARY match model for the T001 stack check.
 * The real engine is spatial and hybrid (ADR-007); this Poisson stub only proves the core is
 * fast enough and later becomes the basis of the quick mode for background matches.
 */
import { abilityAt } from './ratings'
import type { Rng } from './rng'
import type { Player, Position } from './types'

export interface TeamStrength {
  attack: number
  defence: number
}

/** 4-3-3 slots used to pick the starting eleven. */
const LINEUP: readonly Position[] = ['GK', 'CB', 'CB', 'FB', 'FB', 'DM', 'CM', 'CM', 'W', 'W', 'ST']
const ATTACK_SLOTS: readonly (readonly [number, number])[] = [
  [6, 1],
  [7, 1],
  [8, 1.2],
  [9, 1.2],
  [10, 1.8],
]
const DEFENCE_SLOTS: readonly (readonly [number, number])[] = [
  [0, 1.6],
  [1, 1.3],
  [2, 1.3],
  [3, 1],
  [4, 1],
  [5, 1.1],
]

function weightedMean(
  values: readonly number[],
  slots: readonly (readonly [number, number])[],
): number {
  let sum = 0
  let total = 0
  for (const [index, weight] of slots) {
    sum += (values[index] ?? 0) * weight
    total += weight
  }
  return sum / total
}

/** Greedy best eleven: each slot takes the best remaining player who can play there. */
export function teamStrength(squad: readonly Player[]): TeamStrength {
  const used = new Set<string>()
  const abilities = LINEUP.map((slot) => {
    let best: Player | undefined
    let bestValue = -1
    for (const player of squad) {
      if (used.has(player.id)) continue
      const natural = player.positions.includes(slot)
      // Out of position counts, but at a heavy discount.
      const value = abilityAt(player, slot) - (natural ? 0 : 4)
      if (value > bestValue) {
        best = player
        bestValue = value
      }
    }
    if (best) used.add(best.id)
    return Math.max(1, bestValue)
  })
  return {
    attack: weightedMean(abilities, ATTACK_SLOTS),
    defence: weightedMean(abilities, DEFENCE_SLOTS),
  }
}

const BASE_GOALS = 1.32
const HOME_ADVANTAGE = 1.12
const SHARPNESS = 2.4

export interface Score {
  home: number
  away: number
}

export function playMatch(rng: Rng, home: TeamStrength, away: TeamStrength): Score {
  const homeMean = BASE_GOALS * HOME_ADVANTAGE * (home.attack / away.defence) ** SHARPNESS
  const awayMean = (BASE_GOALS / HOME_ADVANTAGE) * (away.attack / home.defence) ** SHARPNESS
  return { home: rng.poisson(homeMean), away: rng.poisson(awayMean) }
}

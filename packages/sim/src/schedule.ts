export interface Fixture {
  round: number
  homeId: string
  awayId: string
}

/**
 * Double round-robin by the circle method: with N clubs (N even) there are 2·(N−1) rounds,
 * every club plays once per round and meets every other club once at home and once away.
 */
export function doubleRoundRobin(clubIds: readonly string[]): Fixture[] {
  if (clubIds.length % 2 !== 0)
    throw new Error('doubleRoundRobin: an even number of clubs is required')
  const n = clubIds.length
  const rotating = clubIds.slice(1)
  const fixed = clubIds[0] as string
  const firstHalf: Fixture[] = []

  for (let round = 0; round < n - 1; round++) {
    const lineup = [fixed, ...rotating]
    for (let i = 0; i < n / 2; i++) {
      const a = lineup[i] as string
      const b = lineup[n - 1 - i] as string
      // Alternate home sides so nobody gets long home or away streaks.
      const swap = (round + i) % 2 === 1
      firstHalf.push({ round: round + 1, homeId: swap ? b : a, awayId: swap ? a : b })
    }
    rotating.unshift(rotating.pop() as string)
  }

  const secondHalf = firstHalf.map((f) => ({
    round: f.round + n - 1,
    homeId: f.awayId,
    awayId: f.homeId,
  }))
  return [...firstHalf, ...secondHalf]
}

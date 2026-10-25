export interface Measurement {
  name: string
  runs: number
  averageMs: number
  minMs: number
  maxMs: number
}

/** Runs `fn` `runs` times and reports wall-clock timings in milliseconds. */
export function measure(name: string, fn: () => void, runs = 5): Measurement {
  const times: number[] = []
  for (let i = 0; i < runs; i++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }
  return {
    name,
    runs,
    averageMs: times.reduce((sum, t) => sum + t, 0) / runs,
    minMs: Math.min(...times),
    maxMs: Math.max(...times),
  }
}

export function formatMeasurement(m: Measurement): string {
  const ms = (v: number): string => `${v.toFixed(2)} ms`
  return `${m.name}: avg ${ms(m.averageMs)} (min ${ms(m.minMs)}, max ${ms(m.maxMs)}, ${m.runs} runs)`
}

import * as Comlink from 'comlink'
import type { SimApi } from './sim.worker'

export type SimClient = Comlink.Remote<SimApi>

let client: SimClient | null = null

/** One simulation worker per window, created on first use. */
export function sim(): SimClient {
  if (!client) {
    const worker = new Worker(new URL('./sim.worker.ts', import.meta.url), { type: 'module' })
    client = Comlink.wrap<SimApi>(worker)
  }
  return client
}

declare global {
  interface Window {
    /** Debug and e2e hook: the same worker API the screens use. */
    __fmSim?: () => SimClient
  }
}

window.__fmSim = sim

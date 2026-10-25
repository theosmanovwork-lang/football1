/**
 * Simulation core. Pure TypeScript: no React, DOM, Electron or Node APIs.
 * The world generator, match model and season runner arrive in T001 step 3.
 */

export const SIM_VERSION = '0.0.1'

export interface CoreInfo {
  version: string
}

export function getCoreInfo(): CoreInfo {
  return { version: SIM_VERSION }
}

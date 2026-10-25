import { describe, expect, it } from 'vitest'
import { getCoreInfo, SIM_VERSION } from './index'

describe('getCoreInfo', () => {
  it('reports the core version', () => {
    expect(getCoreInfo()).toEqual({ version: SIM_VERSION })
  })
})

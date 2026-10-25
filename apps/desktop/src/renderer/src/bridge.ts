import type { AppApi } from '@fm/shared'

/** Stand-in for the preload bridge when the renderer runs in a plain browser. */
export const mockApi: AppApi = {
  getAppInfo: () =>
    Promise.resolve({ name: 'FM', version: '0.0.1', platform: 'web', runtime: 'web' }),
}

export const api: AppApi = window.api ?? mockApi

import type { AppApi } from '@fm/shared'

/** Stand-in for the preload bridge when the renderer runs in a plain browser. */
export const mockApi: AppApi = {
  getAppInfo: () =>
    Promise.resolve({ name: 'FM', version: '0.0.1', platform: 'web', runtime: 'web' }),
  // There is no native window in the browser; the page background already follows the theme.
  setTheme: () => Promise.resolve(),
  // Browser zoom stays with the browser (Ctrl +/-); Electron applies the zoom factor natively.
  setZoom: () => Promise.resolve(),
}

export const api: AppApi = window.api ?? mockApi

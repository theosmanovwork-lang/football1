import type { AppApi } from '@fm/shared'

declare global {
  interface Window {
    /** Present in Electron (preload). Absent in `npm run dev:web`, where the mock is used. */
    api?: AppApi
  }
}

export {}

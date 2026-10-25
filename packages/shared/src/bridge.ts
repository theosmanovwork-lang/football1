/**
 * Contract of the typed bridge that preload exposes to the renderer as `window.api`.
 * The renderer gets OS, disk and Steam access only through this interface.
 */

export type Runtime = 'electron' | 'web'

export interface AppInfo {
  name: string
  version: string
  /** `process.platform` in Electron, `'web'` in the browser mock. */
  platform: string
  runtime: Runtime
}

export interface AppApi {
  getAppInfo(): Promise<AppInfo>
}

/** IPC channel names shared by main and preload. */
export const IpcChannel = {
  getAppInfo: 'app:get-info',
} as const

export type IpcChannel = (typeof IpcChannel)[keyof typeof IpcChannel]

/**
 * Contract of the typed bridge that preload exposes to the renderer as `window.api`.
 * The renderer gets OS, disk and Steam access only through this interface.
 */

export type Runtime = 'electron' | 'web'

export type ThemeName = 'dark' | 'light'

/** Interface scale steps offered in settings (CLAUDE.md, "Окно и адаптивность"). */
export const ZOOM_LEVELS = [0.9, 1, 1.1, 1.25] as const
export type ZoomLevel = (typeof ZOOM_LEVELS)[number]

export interface AppInfo {
  name: string
  version: string
  /** `process.platform` in Electron, `'web'` in the browser mock. */
  platform: string
  runtime: Runtime
}

export interface AppApi {
  getAppInfo(): Promise<AppInfo>
  /** Paints the native window background in the theme color so resizing and fullscreen never flash white. */
  setTheme(theme: ThemeName): Promise<void>
  /** Vector interface scale via Electron's zoom factor. */
  setZoom(zoom: ZoomLevel): Promise<void>
}

/** IPC channel names shared by main and preload. */
export const IpcChannel = {
  getAppInfo: 'app:get-info',
  setTheme: 'window:set-theme',
  setZoom: 'window:set-zoom',
} as const

export type IpcChannel = (typeof IpcChannel)[keyof typeof IpcChannel]

/** Window background per theme; must match `--app-bg` in the renderer's styles.css. */
export const WINDOW_BACKGROUND: Record<ThemeName, string> = {
  dark: '#0B0C0E',
  light: '#F4F4F5',
}

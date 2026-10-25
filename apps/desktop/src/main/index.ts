import { join } from 'node:path'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import {
  IpcChannel,
  WINDOW_BACKGROUND,
  ZOOM_LEVELS,
  type AppInfo,
  type ThemeName,
  type ZoomLevel,
} from '@fm/shared'
import { loadWindowState, trackWindowState, type WindowState } from './window-state'

// Loaded once the app is ready: checking saved bounds against the displays needs the `screen` module.
let windowState: WindowState

function createWindow(): void {
  const { bounds } = windowState
  const window = new BrowserWindow({
    width: bounds?.width ?? 1440,
    height: bounds?.height ?? 900,
    ...(bounds ? { x: bounds.x, y: bounds.y } : {}),
    minWidth: 720,
    minHeight: 480,
    show: false,
    autoHideMenuBar: true,
    // Matches the theme so resizing and fullscreen transitions never flash white.
    backgroundColor: WINDOW_BACKGROUND[windowState.theme],
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      // Hard security rule (CLAUDE.md): never relax these, not even for steamworks.js.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // The season keeps simulating while the window is minimized or hidden.
      backgroundThrottling: false,
    },
  })

  if (windowState.maximized) window.maximize()
  if (windowState.fullScreen) window.setFullScreen(true)
  trackWindowState(window, windowState)

  window.once('ready-to-show', () => window.show())

  // Links open in the system browser, never inside the app window.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url)
    return { action: 'deny' }
  })

  const devServerUrl = process.env['ELECTRON_RENDERER_URL']
  if (!app.isPackaged && devServerUrl) {
    void window.loadURL(devServerUrl)
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function isTheme(value: unknown): value is ThemeName {
  return value === 'dark' || value === 'light'
}

function isZoom(value: unknown): value is ZoomLevel {
  return ZOOM_LEVELS.some((level) => level === value)
}

function registerIpc(): void {
  ipcMain.handle(IpcChannel.getAppInfo, (): AppInfo => ({
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
    runtime: 'electron',
  }))

  ipcMain.handle(IpcChannel.setTheme, (event, theme: unknown) => {
    if (!isTheme(theme)) return
    windowState.theme = theme
    BrowserWindow.fromWebContents(event.sender)?.setBackgroundColor(WINDOW_BACKGROUND[theme])
  })

  ipcMain.handle(IpcChannel.setZoom, (event, zoom: unknown) => {
    if (isZoom(zoom)) event.sender.setZoomFactor(zoom)
  })
}

void app.whenReady().then(() => {
  windowState = loadWindowState()
  registerIpc()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { app, screen, type BrowserWindow, type Rectangle } from 'electron'
import type { ThemeName } from '@fm/shared'

/** What the window remembers between launches (CLAUDE.md, "Окно и адаптивность"). */
export interface WindowState {
  bounds?: Rectangle
  maximized: boolean
  fullScreen: boolean
  theme: ThemeName
}

const DEFAULT_STATE: WindowState = { maximized: false, fullScreen: false, theme: 'dark' }

function stateFile(): string {
  return join(app.getPath('userData'), 'window-state.json')
}

export function loadWindowState(): WindowState {
  try {
    const raw = JSON.parse(readFileSync(stateFile(), 'utf-8')) as Partial<WindowState>
    const state: WindowState = { ...DEFAULT_STATE, ...raw }
    // A monitor that was unplugged since the last launch: fall back to the primary display.
    if (state.bounds && !isOnSomeDisplay(state.bounds)) delete state.bounds
    return state
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveWindowState(state: WindowState): void {
  try {
    writeFileSync(stateFile(), JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save window state', error)
  }
}

function isOnSomeDisplay(bounds: Rectangle): boolean {
  return screen.getAllDisplays().some(({ workArea: a }) => {
    const overlapX = Math.min(bounds.x + bounds.width, a.x + a.width) - Math.max(bounds.x, a.x)
    const overlapY = Math.min(bounds.y + bounds.height, a.y + a.height) - Math.max(bounds.y, a.y)
    return overlapX >= 100 && overlapY >= 50
  })
}

/** Keeps `state` in sync with the window and writes it to disk when the window closes. */
export function trackWindowState(window: BrowserWindow, state: WindowState): void {
  const capture = (): void => {
    state.maximized = window.isMaximized()
    state.fullScreen = window.isFullScreen()
    // Normal bounds survive maximize and fullscreen, so restoring lands on the user's size.
    if (!state.maximized && !state.fullScreen) state.bounds = window.getNormalBounds()
  }
  window.on('resize', capture)
  window.on('move', capture)
  window.on('close', () => {
    capture()
    saveWindowState(state)
  })
}

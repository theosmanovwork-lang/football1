import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Renderer in a plain browser, without Electron. `window.api` is absent there,
// so the renderer falls back to the bridge mock (src/renderer/src/bridge.ts).
export default defineConfig({
  root: resolve(import.meta.dirname, 'src/renderer'),
  plugins: [react()],
  server: { port: 5173, strictPort: true },
})

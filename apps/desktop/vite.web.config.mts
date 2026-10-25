import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Renderer in a plain browser, without Electron. `window.api` is absent there,
// so the renderer falls back to the bridge mock (src/renderer/src/bridge.ts).
export default defineConfig({
  root: resolve(import.meta.dirname, 'src/renderer'),
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src/renderer/src') } },
  plugins: [react(), tailwindcss()],
  server: { port: 5173, strictPort: true },
})

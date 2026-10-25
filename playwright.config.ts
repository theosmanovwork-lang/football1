import { defineConfig, devices } from '@playwright/test'

// UI tests run against `npm run dev:web`: the renderer in Chromium with the bridge mock.
// PLAYWRIGHT_CHROMIUM_PATH points at an already installed Chromium (e.g. in cloud sessions);
// without it, run `npx playwright install chromium` once.
const chromiumPath = process.env['PLAYWRIGHT_CHROMIUM_PATH']

export default defineConfig({
  testDir: 'apps/desktop/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    ...(chromiumPath ? { launchOptions: { executablePath: chromiumPath } } : {}),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev:web',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
  },
})

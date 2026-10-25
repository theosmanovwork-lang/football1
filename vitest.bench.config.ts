import { defineConfig } from 'vitest/config'

// `npm run bench`: timing suites that print averages over several runs.
// Kept apart from `npm test` so regular test runs stay fast.
export default defineConfig({
  test: {
    include: ['packages/*/bench/**/*.bench.ts'],
    testTimeout: 120_000,
    disableConsoleIntercept: true,
  },
})

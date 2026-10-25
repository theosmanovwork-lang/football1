import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/out/**',
      '**/dist/**',
      '**/release/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['apps/desktop/src/renderer/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Hard architecture rules 1 and 2 (CLAUDE.md): the simulation core is isolated and deterministic.
  {
    files: ['packages/sim/**/*.ts'],
    languageOptions: { globals: {} },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-*',
                'electron',
                'node:*',
                'fs',
                'path',
                'os',
                'child_process',
              ],
              message: 'The simulation core must not depend on React, Electron, DOM or Node APIs.',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Use the seeded RNG from rng.ts.' },
        { object: 'Date', property: 'now', message: 'The core must not read the clock.' },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'No network requests from the simulation core.' },
        { name: 'window', message: 'No DOM in the simulation core.' },
        { name: 'document', message: 'No DOM in the simulation core.' },
        { name: 'process', message: 'No Node APIs in the simulation core.' },
      ],
    },
  },
  prettier,
)

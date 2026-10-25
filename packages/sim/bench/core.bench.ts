import { expect, test } from 'vitest'
import { getCoreInfo } from '../src/index'
import { formatMeasurement, measure } from './measure'

// Placeholder so `npm run bench` works from day one.
// World generation and full-season benchmarks replace it in T001 step 3.
test('core info', () => {
  const result = measure('getCoreInfo', () => {
    getCoreInfo()
  })
  console.log(formatMeasurement(result))
  expect(result.runs).toBe(5)
})

import { describe, expect, it } from 'vitest'
import {
  bucketDefaults,
  bucketFor,
  computeLayout,
  CONTENT_MIN,
  NAV_COMPACT,
  NAV_DEFAULT,
  type Bucket,
} from './layout'

function layoutAt(width: number, overrides: Partial<Parameters<typeof computeLayout>[0]> = {}) {
  const bucket = bucketFor(width)
  const d = bucketDefaults(bucket)
  return computeLayout({
    width,
    bucket,
    navCompact: d.navCompact,
    navPx: NAV_DEFAULT,
    panelPx: d.panelPx,
    panelOpen: d.panelOpen,
    ...overrides,
  })
}

describe('bucketFor', () => {
  it.each<[number, Bucket]>([
    [1920, 'xl'],
    [1440, 'xl'],
    [1439, 'lg'],
    [1200, 'lg'],
    [1199, 'md'],
    [1025, 'md'],
    [1024, 'sm'],
    [861, 'sm'],
    [860, 'xs'],
    [720, 'xs'],
  ])('%i px → %s', (width, bucket) => {
    expect(bucketFor(width)).toBe(bucket)
  })
})

describe('computeLayout', () => {
  it('matches the mockup at 1440: full menu, inline panel 320, content 888', () => {
    const m = layoutAt(1440)
    expect(m.navWidth).toBe(224)
    expect(m.panelInline).toBe(true)
    expect(m.panelPx).toBe(320)
    expect(m.contentWidth).toBe(888)
  })

  it('narrows the panel to 284 at 1200', () => {
    const m = layoutAt(1200)
    expect(m.panelInline).toBe(true)
    expect(m.panelPx).toBe(284)
    expect(m.contentWidth).toBe(1200 - 224 - 8 - 284)
  })

  it('collapses the menu to icons at 1024 and slides the panel over the content', () => {
    const m = layoutAt(1024)
    expect(m.navWidth).toBe(NAV_COMPACT)
    expect(m.panelInline).toBe(false)
    expect(m.contentWidth).toBe(956)
  })

  it('hides the menu at 800', () => {
    const m = layoutAt(800)
    expect(m.navWidth).toBe(0)
    expect(m.contentWidth).toBe(792)
  })

  it('never lets the content get narrower than 560 px', () => {
    for (let width = 720; width <= 2560; width += 7) {
      for (const navPx of [180, 224, 320]) {
        for (const panelPx of [260, 320, 480]) {
          const m = layoutAt(width, { navPx, panelPx })
          if (bucketFor(width) !== 'xs') expect(m.contentWidth).toBeGreaterThanOrEqual(CONTENT_MIN)
        }
      }
    }
  })

  it('turns the panel into an overlay when an inline panel would squeeze the content', () => {
    // 1200 px with a 320 px menu leaves 1200 - 8 - 320 - 560 = 312 px for the panel: still inline.
    expect(layoutAt(1200, { navPx: 320 }).panelInline).toBe(true)
    // A wide menu at the lower edge of "lg" pushes the inline panel below its minimum.
    expect(layoutAt(1200, { navPx: 400 }).panelInline).toBe(false)
  })

  it('clamps the menu width so the content keeps 560 px', () => {
    const m = layoutAt(1200, { panelPx: 480 })
    expect(m.navMax).toBeLessThanOrEqual(1200 - 8 - m.panelPx - CONTENT_MIN)
  })
})

/**
 * Window layout rules from CLAUDE.md ("Окно и адаптивность") and the home mockup
 * (docs/design/source/home/Desk.dc.html: bucketFor, defaults, metrics).
 * Pure functions: the shell only renders what these return.
 */

export type Bucket = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

export const NAV_DEFAULT = 224
export const NAV_MIN = 180
export const NAV_MAX = 320
export const NAV_COMPACT = 60
export const NAV_DRAWER = 248
export const PANEL_MIN = 260
export const PANEL_MAX = 480
/** The content area is never narrower than this; panels give way first. */
export const CONTENT_MIN = 560
/** Gap between the content card and the window edge. */
export const GUTTER = 8

export function bucketFor(width: number): Bucket {
  if (width >= 1440) return 'xl'
  if (width >= 1200) return 'lg'
  if (width > 1024) return 'md'
  if (width > 860) return 'sm'
  return 'xs'
}

export interface BucketDefaults {
  panelOpen: boolean
  navCompact: boolean
  navHidden: boolean
  panelPx: number
}

const DEFAULTS: Record<Bucket, BucketDefaults> = {
  xl: { panelOpen: true, navCompact: false, navHidden: false, panelPx: 320 },
  lg: { panelOpen: true, navCompact: false, navHidden: false, panelPx: 284 },
  md: { panelOpen: false, navCompact: false, navHidden: false, panelPx: 340 },
  sm: { panelOpen: false, navCompact: true, navHidden: false, panelPx: 340 },
  xs: { panelOpen: false, navCompact: false, navHidden: true, panelPx: 340 },
}

export function bucketDefaults(bucket: Bucket): BucketDefaults {
  return DEFAULTS[bucket]
}

/** Only the two widest buckets may show the right panel inline; narrower ones slide it over the content. */
function allowsInlinePanel(bucket: Bucket): boolean {
  return bucket === 'xl' || bucket === 'lg'
}

export interface LayoutInput {
  width: number
  bucket: Bucket
  navCompact: boolean
  navPx: number
  panelPx: number
  panelOpen: boolean
}

export interface LayoutMetrics {
  /** Width the sidebar occupies in the flow (0 when hidden; the drawer floats above). */
  navWidth: number
  /** Whether the right panel sits in the flow (true) or slides over the content (false). */
  panelInline: boolean
  panelPx: number
  panelMin: number
  panelMax: number
  navMin: number
  navMax: number
  contentWidth: number
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function computeLayout(input: LayoutInput): LayoutMetrics {
  const { width, bucket } = input
  const navWidth = bucket === 'xs' ? 0 : input.navCompact ? NAV_COMPACT : input.navPx
  const panelMaxInline = Math.min(PANEL_MAX, width - GUTTER - navWidth - CONTENT_MIN)
  const panelInline = allowsInlinePanel(bucket) && panelMaxInline >= PANEL_MIN
  const panelMax = panelInline ? panelMaxInline : Math.min(PANEL_MAX, width - 48)
  const panelPx = clamp(input.panelPx, PANEL_MIN, Math.max(PANEL_MIN, panelMax))
  const inlinePanelWidth = input.panelOpen && panelInline ? panelPx : 0
  const navMax = Math.max(
    NAV_MIN,
    Math.min(NAV_MAX, width - GUTTER - inlinePanelWidth - CONTENT_MIN),
  )
  return {
    navWidth,
    panelInline,
    panelPx,
    panelMin: PANEL_MIN,
    panelMax,
    navMin: NAV_MIN,
    navMax,
    contentWidth: width - navWidth - GUTTER - inlinePanelWidth,
  }
}

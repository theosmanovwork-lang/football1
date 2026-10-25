import type { Tone } from './homeData'

/** Tone → token classes. Colors live in styles.css; components never use raw hex. */
export const TONE_TEXT: Record<Tone, string> = {
  brand: 'text-brand',
  warn: 'text-warn',
  caution: 'text-caution',
  danger: 'text-danger',
  info: 'text-info',
  violet: 'text-violet',
  neutral: 'text-fg-subtle',
  dim: 'text-fg-dim',
}

export const TONE_BG: Record<Tone, string> = {
  brand: 'bg-brand',
  warn: 'bg-warn',
  caution: 'bg-caution',
  danger: 'bg-danger',
  info: 'bg-info',
  violet: 'bg-violet',
  neutral: 'bg-fg-3',
  dim: 'bg-fg-dim',
}

export const TONE_BORDER: Record<Tone, string> = {
  brand: 'border-brand',
  warn: 'border-warn',
  caution: 'border-caution',
  danger: 'border-danger',
  info: 'border-info',
  violet: 'border-violet',
  neutral: 'border-fg-subtle',
  dim: 'border-fg-dim',
}

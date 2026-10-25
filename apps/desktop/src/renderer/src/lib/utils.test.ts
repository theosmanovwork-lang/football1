import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('keeps a type-scale size next to a text color', () => {
    expect(cn('text-label', 'text-info')).toBe('text-label text-info')
    expect(cn('text-micro text-brand-fg')).toBe('text-micro text-brand-fg')
  })

  it('still resolves conflicting sizes', () => {
    expect(cn('text-meta', 'text-widget')).toBe('text-widget')
  })
})

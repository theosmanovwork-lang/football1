import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge must know the custom type scale from styles.css; otherwise it reads
 * `text-meta` as a color and drops it next to `text-fg-subtle` (or the other way round).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['entity', 'object', 'section', 'widget', 'body', 'meta', 'label', 'micro'] },
      ],
    },
  },
})

/** Joins class names and resolves conflicting Tailwind classes (shadcn/ui convention). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

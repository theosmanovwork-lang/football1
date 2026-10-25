import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Three button levels (CLAUDE.md, «Типографика и иерархия»):
 * primary — accent fill, one per screen; secondary — raised with a visible border;
 * quiet — border only or none. Large 44 px+ buttons are for the match-day tablet only.
 */
export const buttonVariants = cva(
  'inline-flex flex-none cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-body transition-colors duration-[120ms] ease-out disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'rounded-[7px] border-0 bg-brand font-semibold text-brand-fg hover:brightness-110',
        secondary:
          'rounded-[7px] border border-line-button bg-selected-strong font-semibold text-fg-strong hover:bg-line-strong',
        quiet:
          'rounded-[7px] border border-line-control bg-transparent font-medium text-fg-2 hover:bg-selected',
      },
      size: {
        md: 'h-8 px-3.5',
        sm: 'h-7 px-2.5',
      },
    },
    defaultVariants: { variant: 'quiet', size: 'md' },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

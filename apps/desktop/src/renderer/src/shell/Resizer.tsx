import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { clamp } from '@/layout/layout'
import { cn } from '@/lib/utils'

interface ResizerProps {
  /** Which edge of the panel the handle sits on; dragging away from the panel widens it. */
  edge: 'right' | 'left'
  label: string
  value: number
  min: number
  max: number
  onChange(px: number): void
  onReset(): void
}

/**
 * Drag handle on a panel border: pointer drag, arrow keys (Shift for bigger steps),
 * Home or double-click to reset (mockup: startDrag / keyResize).
 */
export function Resizer({ edge, label, value, min, max, onChange, onReset }: ResizerProps) {
  const start = useRef<{ x: number; width: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const direction = edge === 'right' ? 1 : -1

  function onPointerDown(e: PointerEvent<HTMLButtonElement>): void {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, width: value }
    setDragging(true)
  }

  function onPointerMove(e: PointerEvent<HTMLButtonElement>): void {
    if (!start.current) return
    const dx = (e.clientX - start.current.x) * direction
    onChange(Math.round(clamp(start.current.width + dx, min, max)))
  }

  function onPointerUp(): void {
    start.current = null
    setDragging(false)
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>): void {
    if (e.key === 'Home') {
      e.preventDefault()
      onReset()
      return
    }
    const sign = e.key === 'ArrowRight' ? direction : e.key === 'ArrowLeft' ? -direction : 0
    if (!sign) return
    e.preventDefault()
    onChange(clamp(value + sign * (e.shiftKey ? 48 : 16), min, max))
  }

  return (
    <button
      type="button"
      aria-label={`${label}: ${value} px. Стрелки меняют ширину, Home — по умолчанию`}
      title="Потяните, чтобы изменить ширину · двойной щелчок — по умолчанию"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onReset}
      onKeyDown={onKeyDown}
      className={cn(
        'group absolute top-0 bottom-0 z-[3] w-2.5 cursor-col-resize border-0 bg-transparent p-0',
        edge === 'right' ? '-right-[5px]' : '-left-[5px]',
      )}
    >
      <span
        className={cn(
          'absolute top-0 bottom-0 left-1 w-0.5 transition-colors duration-[120ms]',
          dragging ? 'bg-brand' : 'group-hover:bg-line-strong',
        )}
      />
    </button>
  )
}

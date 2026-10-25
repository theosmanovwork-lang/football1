import { ZOOM_LEVELS, type ThemeName, type ZoomLevel } from '@fm/shared'
import { useUi, type Density } from '@/store/ui'
import { cn } from '@/lib/utils'

interface Option<T> {
  value: T
  label: string
}

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Option<T>[]
  value: T
  onChange(value: T): void
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-line-faint py-3">
      <span className="text-fg-2">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1.5">
        {options.map((option) => {
          const on = option.value === value
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(option.value)}
              className={cn(
                'h-7 rounded-full border px-3 text-meta font-medium transition-colors duration-[120ms]',
                on
                  ? 'border-line-strong bg-selected-strong text-fg-strong'
                  : 'border-line-control bg-transparent text-fg-3 hover:bg-selected',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const THEMES: Option<ThemeName>[] = [
  { value: 'dark', label: 'Тёмная' },
  { value: 'light', label: 'Светлая' },
]
const DENSITIES: Option<Density>[] = [
  { value: 'compact', label: 'Компактная' },
  { value: 'comfortable', label: 'Комфортная' },
]
const ZOOMS: Option<ZoomLevel>[] = ZOOM_LEVELS.map((z) => ({
  value: z,
  label: `${Math.round(z * 100)}%`,
}))

/** Minimal settings list until the settings mockup arrives. */
export function SettingsScreen() {
  const { theme, density, zoom, setTheme, setDensity, setZoom } = useUi()
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-xl px-6 py-6">
        <h2 className="m-0 mb-2 text-meta font-medium text-fg-subtle">Вид</h2>
        <Segmented label="Тема" options={THEMES} value={theme} onChange={setTheme} />
        <Segmented label="Плотность" options={DENSITIES} value={density} onChange={setDensity} />
        <Segmented label="Масштаб интерфейса" options={ZOOMS} value={zoom} onChange={setZoom} />
      </div>
    </div>
  )
}

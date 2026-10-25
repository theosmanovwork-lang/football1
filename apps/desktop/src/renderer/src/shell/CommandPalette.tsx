import { Command } from 'cmdk'
import { Moon, PanelLeft, PanelRight, Rows3, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { ALL_SECTIONS } from '@/navigation'
import { useUi } from '@/store/ui'

const ICON = { size: 16, strokeWidth: 1.7, 'aria-hidden': true } as const

function Item({
  onSelect,
  icon,
  children,
}: {
  onSelect(): void
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex h-8 cursor-default items-center gap-2.5 rounded-md px-2.5 text-fg-2 data-[selected=true]:bg-selected-strong data-[selected=true]:text-fg-strong"
    >
      {icon}
      {children}
    </Command.Item>
  )
}

const groupClass =
  '[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-label [&_[cmdk-group-heading]]:text-fg-subtle'

/** Ctrl+K / Cmd+K: jump to any section and run interface commands. */
export function CommandPalette() {
  const open = useUi((s) => s.paletteOpen)
  const setOpen = useUi((s) => s.setPaletteOpen)
  const theme = useUi((s) => s.theme)
  const density = useUi((s) => s.density)
  const panelOpen = useUi((s) => s.panelOpen)
  const { setSection, setTheme, setDensity, toggleNav, togglePanel } = useUi.getState()

  function run(action: () => void): void {
    action()
    setOpen(false)
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Командная палитра"
      overlayClassName="fixed inset-0 z-40 bg-scrim"
      contentClassName="fixed top-[14vh] left-1/2 z-50 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-lg border border-line-control bg-raised text-fg shadow-overlay"
    >
      <Command.Input
        placeholder="Перейти или выполнить команду…"
        className="h-11 w-full border-0 border-b border-line bg-transparent px-3.5 text-body text-fg outline-none placeholder:text-fg-faint"
      />
      <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-1">
        <Command.Empty className="px-3 py-6 text-center text-fg-subtle">
          Ничего не найдено
        </Command.Empty>
        <Command.Group heading="Перейти" className={groupClass}>
          {ALL_SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <Item
                key={section.id}
                icon={<Icon {...ICON} />}
                onSelect={() => run(() => setSection(section.id))}
              >
                {section.label}
              </Item>
            )
          })}
        </Command.Group>
        <Command.Group heading="Интерфейс" className={groupClass}>
          <Item
            icon={theme === 'dark' ? <Sun {...ICON} /> : <Moon {...ICON} />}
            onSelect={() => run(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          </Item>
          <Item
            icon={<Rows3 {...ICON} />}
            onSelect={() =>
              run(() => setDensity(density === 'compact' ? 'comfortable' : 'compact'))
            }
          >
            {density === 'compact' ? 'Комфортная плотность' : 'Компактная плотность'}
          </Item>
          <Item icon={<PanelLeft {...ICON} />} onSelect={() => run(toggleNav)}>
            Свернуть или развернуть меню
          </Item>
          <Item icon={<PanelRight {...ICON} />} onSelect={() => run(togglePanel)}>
            {panelOpen ? 'Скрыть боковую панель' : 'Показать боковую панель'}
          </Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}

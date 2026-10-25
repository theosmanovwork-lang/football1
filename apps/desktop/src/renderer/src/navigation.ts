import {
  ArrowLeftRight,
  Activity,
  Banknote,
  Calendar,
  ChartLine,
  ChartNoAxesColumn,
  ChartSpline,
  CircleDot,
  Flag,
  Globe,
  Heart,
  House,
  Inbox,
  Landmark,
  PenLine,
  Search,
  Settings,
  SquareSplitHorizontal,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type SectionId =
  | 'inbox'
  | 'calendar'
  | 'notes'
  | 'home'
  | 'squad'
  | 'tactics'
  | 'setPieces'
  | 'matchDay'
  | 'medical'
  | 'load'
  | 'training'
  | 'dataCenter'
  | 'scouting'
  | 'transfers'
  | 'world'
  | 'board'
  | 'finance'
  | 'dataDept'
  | 'settings'

export interface Section {
  id: SectionId
  label: string
  icon: LucideIcon
  /** Placeholder badge counts from the mockup; real counts come from the core later. */
  count?: number
}

export interface SectionGroup {
  title: string
  items: Section[]
}

/** Sidebar order and labels from the home mockup (docs/design/home-1440.png). */
export const NAV_TOP: Section[] = [
  { id: 'inbox', label: 'Входящие', icon: Inbox, count: 7 },
  { id: 'calendar', label: 'Календарь', icon: Calendar },
  { id: 'notes', label: 'Тактический блокнот', icon: PenLine },
]

export const NAV_GROUPS: SectionGroup[] = [
  {
    title: 'Команда',
    items: [
      { id: 'home', label: 'Главная', icon: House },
      { id: 'squad', label: 'Состав', icon: Users },
      { id: 'tactics', label: 'Тактика', icon: SquareSplitHorizontal },
      { id: 'setPieces', label: 'Стандарты', icon: Flag },
      { id: 'matchDay', label: 'Матчевый день', icon: CircleDot },
    ],
  },
  {
    title: 'Здоровье',
    items: [
      { id: 'medical', label: 'Медцентр', icon: Heart, count: 3 },
      { id: 'load', label: 'Нагрузка и GPS', icon: Activity },
      { id: 'training', label: 'Тренировки', icon: ChartLine },
    ],
  },
  {
    title: 'Данные и отбор',
    items: [
      { id: 'dataCenter', label: 'Центр данных', icon: ChartNoAxesColumn },
      { id: 'scouting', label: 'Скаутинг', icon: Search, count: 3 },
      { id: 'transfers', label: 'Трансферы', icon: ArrowLeftRight },
      { id: 'world', label: 'Мир', icon: Globe },
    ],
  },
  {
    title: 'Клуб',
    items: [
      { id: 'board', label: 'Совет и цели', icon: Landmark },
      { id: 'finance', label: 'Финансы', icon: Banknote },
      { id: 'dataDept', label: 'Отдел данных', icon: ChartSpline },
    ],
  },
]

export const SETTINGS_SECTION: Section = { id: 'settings', label: 'Настройки', icon: Settings }

export const ALL_SECTIONS: Section[] = [
  ...NAV_TOP,
  ...NAV_GROUPS.flatMap((group) => group.items),
  SETTINGS_SECTION,
]

export function sectionById(id: SectionId): Section {
  const section = ALL_SECTIONS.find((s) => s.id === id)
  if (!section) throw new Error(`Unknown section: ${id}`)
  return section
}

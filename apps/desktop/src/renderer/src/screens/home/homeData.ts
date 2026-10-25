/**
 * Fictional placeholder content copied from the home mockup (docs/design/source/home/Desk.dc.html).
 * The simulation core replaces it in later steps; the UI only renders what it gets (CLAUDE.md rule 3).
 */

export type Tone = 'brand' | 'warn' | 'caution' | 'danger' | 'info' | 'violet' | 'neutral' | 'dim'

export type RowStatus = 'urgent' | 'todo' | 'progress' | 'ready' | 'insight'

export interface FeedRow {
  code: string
  status: RowStatus
  title: string
  chip?: { label: string; tone: Tone }
  /** Initials of the staff member who raised it. */
  owner?: string
  /** Planned training load, percent. */
  load?: { percent: number; tone: Tone }
  meta: string
}

export interface FeedGroup {
  id: string
  title: string
  tone: Tone
  hint: string
  rows: FeedRow[]
}

export const DECISIONS: FeedGroup = {
  id: 'decisions',
  title: 'Требует решения',
  tone: 'warn',
  hint: 'до конца дня',
  rows: [
    {
      code: 'MED-14',
      status: 'urgent',
      title: 'Лиам Харт: растяжение бедра — утвердить этап 2 протокола восстановления',
      chip: { label: 'Медцентр', tone: 'danger' },
      owner: 'ДК',
      meta: '09:12',
    },
    {
      code: 'LOAD-3',
      status: 'urgent',
      title: 'Окафор в зоне риска перегрузки — облегчить вторничную тренировку?',
      chip: { label: 'Нагрузка', tone: 'caution' },
      owner: 'ДК',
      meta: '08:55',
    },
    {
      code: 'TRF-6',
      status: 'todo',
      title: 'СД отклонил запрос на левого защитника: бюджет превышен на 1,8 млн',
      chip: { label: 'Трансферы', tone: 'info' },
      owner: 'СД',
      meta: 'вчера',
    },
    {
      code: 'ANL-21',
      status: 'ready',
      title: 'Пакет подготовки к Вестфилд Сити готов: 3 приоритета, 14 эпизодов',
      chip: { label: 'Аналитика', tone: 'brand' },
      owner: 'МС',
      meta: '08:40',
    },
    {
      code: 'PR-9',
      status: 'progress',
      title: 'Пресс-конференция в пятницу, 13:00 — вопросы о защите после 0:3',
      chip: { label: 'Пресса', tone: 'violet' },
      meta: '08:15',
    },
  ],
}

export const INSIGHTS: FeedGroup = {
  id: 'insights',
  title: 'Инсайты недели',
  tone: 'info',
  hint: 'центр данных и GPS',
  rows: [
    {
      code: 'DATA',
      status: 'insight',
      title: 'Наш прессинг усилился: PPDA 11,2 → 9,8 за последние 3 матча',
      chip: { label: 'Центр данных', tone: 'info' },
      meta: '3 матча',
    },
    {
      code: 'DATA',
      status: 'insight',
      title: 'Вестфилд Сити пропускает 40% голов после угловых у ближней штанги',
      chip: { label: 'Соперник', tone: 'info' },
      meta: '10 туров',
    },
    {
      code: 'GPS',
      status: 'insight',
      title: 'Окафор: спринты падают после 70-й минуты третий матч подряд',
      chip: { label: 'Физданные', tone: 'info' },
      meta: '3 матча',
    },
    {
      code: 'DATA',
      status: 'insight',
      title: 'Тео Мартинес — 2-й в лиге по обойдённым соперникам за 90 минут',
      chip: { label: 'Центр данных', tone: 'info' },
      meta: 'сезон',
    },
  ],
}

export const WEEK_PLAN: FeedGroup = {
  id: 'week',
  title: 'План недели',
  tone: 'neutral',
  hint: 'целевая нагрузка до матча',
  rows: [
    {
      code: 'MD+1',
      status: 'progress',
      title: 'Вс 25 · Восстановление после матча',
      load: { percent: 20, tone: 'brand' },
      meta: 'план 20%',
    },
    {
      code: 'MD-5',
      status: 'todo',
      title: 'Пн 26 · Выходной',
      load: { percent: 0, tone: 'dim' },
      meta: '—',
    },
    {
      code: 'MD-4',
      status: 'todo',
      title: 'Вт 27 · Сила и объём',
      load: { percent: 85, tone: 'dim' },
      meta: 'план 85%',
    },
    {
      code: 'MD-3',
      status: 'todo',
      title: 'Ср 28 · Тактика 11 на 11 · угловые',
      load: { percent: 80, tone: 'dim' },
      meta: 'план 80%',
    },
    {
      code: 'MD-2',
      status: 'todo',
      title: 'Чт 29 · Скорость, короткие игры',
      load: { percent: 55, tone: 'dim' },
      meta: 'план 55%',
    },
    {
      code: 'MD-1',
      status: 'todo',
      title: 'Пт 30 · Активация и стандарты',
      load: { percent: 30, tone: 'dim' },
      meta: 'план 30%',
    },
    {
      code: 'MD',
      status: 'urgent',
      title: 'Сб 31 · Матч с Вестфилд Сити',
      load: { percent: 100, tone: 'caution' },
      meta: 'план 100%',
    },
  ],
}

export interface Kpi {
  label: string
  source: string
  value: string
  delta: string
  deltaTone: Tone
  bars: { percent: number; tone: Tone }[]
  note: string
}

export const KPIS: Kpi[] = [
  {
    label: 'Доступность',
    source: 'Медцентр',
    value: '81%',
    delta: '21 из 26',
    deltaTone: 'neutral',
    bars: [
      { percent: 81, tone: 'brand' },
      { percent: 8, tone: 'caution' },
      { percent: 11, tone: 'danger' },
    ],
    note: 'доступны · ограниченно · недоступны',
  },
  {
    label: 'Готовность команды',
    source: 'Анкеты',
    value: '74',
    delta: '−4 за 7 дней',
    deltaTone: 'caution',
    bars: [{ percent: 74, tone: 'neutral' }],
    note: 'сон, усталость, болезненность',
  },
  {
    label: 'Нагрузка недели',
    source: 'GPS',
    value: '82%',
    delta: 'от плана',
    deltaTone: 'neutral',
    bars: [{ percent: 82, tone: 'info' }],
    note: '2 игрока выше нормы',
  },
  {
    label: 'Прессинг, PPDA',
    source: 'Центр данных',
    value: '9,8',
    delta: '3-е в лиге',
    deltaTone: 'brand',
    bars: [{ percent: 70, tone: 'brand' }],
    note: 'чем ниже, тем агрессивнее',
  },
]

export type LoadZone = 'risk' | 'fit' | 'under'

/** Load × readiness quadrant. `zone` is precomputed (later by the core), the UI only colors it. */
export interface LoadPoint {
  name: string
  load: number
  readiness: number
  zone: LoadZone
  labelled?: boolean
}

export const LOAD_POINTS: LoadPoint[] = [
  { name: 'Окафор', load: 82, readiness: 34, zone: 'risk', labelled: true },
  { name: 'Бреннан', load: 70, readiness: 28, zone: 'risk', labelled: true },
  { name: 'Мартинес', load: 64, readiness: 78, zone: 'fit' },
  { name: 'Ли', load: 58, readiness: 70, zone: 'fit' },
  { name: 'Ковач', load: 46, readiness: 82, zone: 'fit' },
  { name: 'Абади', load: 40, readiness: 64, zone: 'fit' },
  { name: 'Росси', load: 55, readiness: 58, zone: 'fit' },
  { name: 'Нгуен', load: 36, readiness: 74, zone: 'fit' },
  { name: 'Фокс', load: 72, readiness: 62, zone: 'fit' },
  { name: 'Дюбуа', load: 30, readiness: 40, zone: 'under' },
  { name: 'Сато', load: 50, readiness: 86, zone: 'fit' },
  { name: 'Мбеки', load: 62, readiness: 52, zone: 'fit' },
  { name: 'Хольм', load: 44, readiness: 55, zone: 'fit' },
  { name: 'Перес', load: 26, readiness: 66, zone: 'fit' },
]

export type Availability = 'ok' | 'limited' | 'out'

export interface AvailabilityRow {
  position: string
  name: string
  status: Availability
  back: string
}

export const AVAILABILITY: AvailabilityRow[] = [
  { position: 'ЦП', name: 'Лиам Харт', status: 'out', back: '~16 нояб' },
  { position: 'НАП', name: 'Карл Ведберг', status: 'out', back: 'к MD-2' },
  { position: 'ПЗ', name: 'Ян Ковач', status: 'out', back: '2 нед.' },
  { position: 'ЛЗ', name: 'Нико Бреннан', status: 'limited', back: 'после ср' },
  { position: 'ЦЗ', name: 'Самуэль Окафор', status: 'limited', back: 'нагрузка' },
]

export const NEXT_MATCH = {
  heading: 'Следующий матч',
  headingNote: 'через 6 дней',
  fixture: 'Норт Ривер — Вестфилд Сити',
  details: 'Сб, 31 окт · 17:30 · Дома · Тур 11',
  opponentForm: ['В', 'В', 'Н', 'П', 'В'] as const,
  comparison: [
    { metric: 'xG за матч', us: '1,48', them: '1,72', weBetter: false },
    { metric: 'xG против', us: '1,21', them: '1,05', weBetter: false },
    { metric: 'PPDA', us: '9,8', them: '12,4', weBetter: true },
    { metric: 'Высокие возвраты', us: '7,1', them: '5,3', weBetter: true },
    { metric: 'Голы со стандартов', us: '27%', them: '19%', weBetter: true },
    { metric: 'Обойдённые соперники', us: '62', them: '71', weBetter: false },
  ],
  analystNote:
    'Аналитик: их левый центральный защитник проигрывает больше половины единоборств на разворотах — 6 эпизодов в пакете.',
}

export const LEAGUE_SLICE = [
  { position: 3, club: 'Вестфилд Сити', goalDiff: '+9', points: 21 },
  { position: 4, club: 'Кингспорт', goalDiff: '+6', points: 19 },
  { position: 5, club: 'Эшби Роверс', goalDiff: '+4', points: 18 },
  { position: 6, club: 'Норт Ривер', goalDiff: '+3', points: 17, own: true },
  { position: 7, club: 'Хейвен Таун', goalDiff: '+1', points: 16 },
]

export const BOARD_GOALS = [
  { goal: 'Финиш в топ-6', state: 'сейчас 6-е', progress: 0.6 },
  { goal: '3 игрока до 21 года в основе', state: '2 из 3', progress: 0.66 },
]

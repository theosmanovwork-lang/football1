import { useEffect, useState } from 'react'
import type { AppInfo } from '@fm/shared'
import { getCoreInfo } from '@fm/sim'
import { api } from './bridge'

const runtimeLabel: Record<AppInfo['runtime'], string> = {
  electron: 'Приложение Electron',
  web: 'Браузер (мок моста)',
}

// Placeholder until the first screens are built from the user's mockups.
export function App(): React.JSX.Element {
  const [info, setInfo] = useState<AppInfo | null>(null)

  useEffect(() => {
    void api.getAppInfo().then(setInfo)
  }, [])

  return (
    <main className="mx-auto mt-[15vh] max-w-xl px-6">
      <h1 className="mb-1 text-xl font-semibold">Футбольный менеджер</h1>
      <p className="mb-6 text-muted-foreground">
        Каркас проекта готов. Экраны появятся по макетам.
      </p>
      <dl data-testid="app-info" className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
        <dt className="text-muted-foreground">Среда</dt>
        <dd data-testid="runtime">{info ? runtimeLabel[info.runtime] : 'Загрузка…'}</dd>
        <dt className="text-muted-foreground">Платформа</dt>
        <dd>{info?.platform ?? '—'}</dd>
        <dt className="text-muted-foreground">Версия ядра</dt>
        <dd>{getCoreInfo().version}</dd>
      </dl>
    </main>
  )
}

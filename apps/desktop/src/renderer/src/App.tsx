import { useEffect, useState } from 'react'
import type { AppInfo } from '@fm/shared'
import { getCoreInfo } from '@fm/sim'
import { api } from './bridge'

const runtimeLabel: Record<AppInfo['runtime'], string> = {
  electron: 'Приложение Electron',
  web: 'Браузер (мок моста)',
}

export function App(): React.JSX.Element {
  const [info, setInfo] = useState<AppInfo | null>(null)

  useEffect(() => {
    void api.getAppInfo().then(setInfo)
  }, [])

  return (
    <main className="placeholder">
      <h1>Футбольный менеджер</h1>
      <p>Каркас проекта готов. Интерфейс появится на шаге 2.</p>
      <dl data-testid="app-info">
        <dt>Среда</dt>
        <dd data-testid="runtime">{info ? runtimeLabel[info.runtime] : 'Загрузка…'}</dd>
        <dt>Платформа</dt>
        <dd>{info?.platform ?? '—'}</dd>
        <dt>Версия ядра</dt>
        <dd>{getCoreInfo().version}</dd>
      </dl>
    </main>
  )
}

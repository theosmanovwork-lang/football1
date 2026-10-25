import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannel, type AppApi } from '@fm/shared'

// The only surface the renderer gets. Every method is a typed IPC call to main.
const api: AppApi = {
  getAppInfo: () => ipcRenderer.invoke(IpcChannel.getAppInfo),
}

contextBridge.exposeInMainWorld('api', api)

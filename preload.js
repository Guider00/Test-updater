const { contextBridge, ipcRenderer } = require('electron')
const { version } = require('websocket')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),

    getAppVersion: (version) => ipcRenderer.invoke('get-version', version),
})
const { contextBridge, ipcRenderer } = require('electron')
const { version } = require('websocket')
const { setcpu_data, getcpu_data } = require('./global.js')

const API = {
    setTitle: (title) => ipcRenderer.send('set-title', title),

    getAppVersion: (version) => ipcRenderer.invoke('get-version', version),
    getIP:         (ip)      => ipcRenderer.invoke('get-ip', ip),

    getcpuUsage:    (data)     =>   ipcRenderer.invoke('graph-cpu', data),
    nextPage:       ()          => ipcRenderer.send('next-page',),

    handleCPUData:         (callback)  => ipcRenderer.on('cpu-data', callback),
    handleFreeMemData:     (callback)  => ipcRenderer.on('free-mem-data', callback),

}
contextBridge.exposeInMainWorld('electronAPI',API)


const global = require('./global.js')


// window.addEventListener('DOMContentLoaded', () => {

    // ipcRenderer.on('platform', (_event, value) => {
    //     document.getElementById('platform').innerHTML = value;
    // })
    // ipcRenderer.on('ip', (_event, value) => {
    //     document.getElementById('platform').innerHTML = value;
    // })
    // ipcRenderer.on('cpu',(event,data) => {
    //     // setcpu_data(data.toFixed(2)) 
    //     const asdf = getcpu_data();
    //     console.log(asdf);
    // });
    // ipcRenderer.on('free-mem',(event,data) => {
    //     document.getElementById('free-mem').innerHTML = data.toFixed(2);
    // });
    // ipcRenderer.on('total-mem',(event,data) => {
    //     document.getElementById('total-mem').innerHTML = data.toFixed(2);
    // });
// })
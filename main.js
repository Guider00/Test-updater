const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('get-version', async (event, version) => {
  let appVersion = app.getVersion();
  return appVersion;
})


const { autoUpdater } = require('electron-updater')
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.setFeedURL('https://quickmargo.pl/dist/download');

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
});

autoUpdater.on('update-available', (ev, info) => {
    alert('Update required!');
});

app.on('ready', async () => {
    if (process.env.NODE_ENV === 'production') {
        await autoUpdater.checkForUpdates()
    }
});

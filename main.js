const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const osutils = require('os-utils');
var os = require('os');


const global = require('./global.js');
const { getcpu_data, setcpu_data } = require('./global.js');

  let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
    
  })


  setInterval(() => {
    osutils.cpuUsage(function(v){
      // mainWindow.webContents.send('platform', osutils.platform());
      mainWindow.webContents.send('cpu',setcpu_data(((v*100).toFixed(2))));
      console.log(v*100)
      mainWindow.webContents.send('cpu-data', getcpu_data());
      console.log(getcpu_data());
      // mainWindow.webContents.send('free-mem',osutils.freememPercentage()*100);
      // mainWindow.webContents.send('total-mem',osutils.totalmem()/1024);
    });
  },1000);

  // ipcMain.handle('graph-cpu', async (event, data) => {
  //   const CPUdata = getcpu_data();
  //   console.log(CPUdata)
  //   cpu = CPUdata;
  //   return cpu;
  // })




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
ipcMain.handle('get-ip', async (event, version) => {
  var ip = require("ip");
  console.dir ( ip.address() );
  userIP = ip.address();
  return userIP;
})


// const { autoUpdater } = require('electron-updater')
// const log = require('electron-log');

// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';

// autoUpdater.setFeedURL('https://quickmargo.pl/dist/download');

// autoUpdater.on('update-downloaded', () => {
//     autoUpdater.quitAndInstall()
// });

// autoUpdater.on('update-available', (ev, info) => {
//     alert('Update required!');
// });

app.on('ready', async () => {
    if (process.env.NODE_ENV === 'production') {
        await autoUpdater.checkForUpdates()
    }
});

ipcMain.on('next-page', () => {
  mainWindow.loadFile('chart.html')
})

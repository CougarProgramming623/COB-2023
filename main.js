const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'), 
  hardResetMethod: 'exit'
});

const ipc = ipcMain;

let win;
let screenWidth = 1280;
let screenHeight = 486;

function createWindow () {
    win = new BrowserWindow({
      width:     screenWidth,
      minWidth:  screenWidth,
      maxWidth:  screenWidth, 

      height:    screenHeight,
      minHeight: screenHeight,
      maxHeight: screenHeight,

      x: 0,
      y: 0,
      backgroundColor: "#FFDF94",
      center: true,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      }
    })
  
    win.loadFile('src/index.html')
  }


  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // wpilib stuff
const ntClient = require('wpilib-nt-client');
const client = new ntClient.Client();
client.setReconnectDelay(1000);

let clientDataListener = (key, val, valType, mesgType, id, flags) => {
    if (val === 'true' || val === 'false') {
        val = val === 'true';
    }
    win.webContents.send(mesgType, {
        key,
        val,
        valType,
        id,
        flags
    });
  };
  
ipc.on('ready', (ev, mesg) => {
    console.log('NetworkTables is ready');

    // Remove old Listener
    client.removeListener(clientDataListener);

    // Add new listener with immediate callback
    client.addListener(clientDataListener, true);
});
// When the user chooses the address of the bot than try to connect
ipc.on('connect', (ev, address, port) => {
    let callback = (connected, err) => {
        try{
          win.webContents.send('connected', connected); //throws error ere
        } catch(e){ /* errors but works */ }
    };
    if (port) {
        client.start(callback, address, port);
    } else {
        client.start(callback, address);
        console.log("connecting to " + address)
    }
  });
  ipc.on('stop-connect', () => {
    client.stop()
  });
  ipc.on('add', (ev, mesg) => {
    client.Assign(mesg.val, mesg.key, (mesg.flags & 1) === 1);
  });
  ipc.on('update', (ev, mesg) => {
    client.Update(mesg.id, mesg.val);
  });
  ipc.on('delete', (ev, mesg) => {
    client.Delete(mesg.id)
  });
client.addListener(clientDataListener, true);

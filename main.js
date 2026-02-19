const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({//this will create a new window for our app
    width: 480,
    height: 300,
    frame: false,  //this removes the default window frame      
    resizable: false,     
    webPreferences: {//these will allow us to use Node.js features in our script.js
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setMenu(null);      //this removes the default menu bar
  win.loadFile('index.html');//this will load our index.html
}

app.whenReady().then(createWindow);
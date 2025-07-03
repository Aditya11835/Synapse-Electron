const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        width: 960,
        height: 800,
        icon: path.join(__dirname, "assets", "logosynapse.png"),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });
    mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
    createWindow();
    
    ipcMain.on('start-ping', (event) => {
        setInterval(() => {
            event.sender.send('pong', 'pong'); // send to renderer
        }, 1000);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
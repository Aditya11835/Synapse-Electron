const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');

function createMenuTemplate() {
    return [
        {
            label: "File",
            submenu: [
                { role: "quit" },
            ],
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Reload Page",
                    accelerator: "CmdOrCtrl+R",
                    click: (item, focusedWindow) => {
                        if (focusedWindow) focusedWindow.reload();
                    },
                },
                { type: "separator" },
                {
                    label: "Zoom In",
                    role: "zoomIn",
                },
                {
                    label: "Zoom Out",
                    role: "zoomOut",
                },
                {
                    label: "Reset Zoom",
                    role: "resetZoom",
                },
                { type: "separator" },
                {
                    label: "Enter Full Screen",
                    role: "togglefullscreen",
                },
            ],
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Learn More",
                    click: async () => {
                        const { shell } = require("electron");
                        await shell.openExternal("https://electronjs.org");
                    },
                },
            ],
        },
    ];
}


let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        //fullscreen: true,
        show: false,
        icon: path.join(__dirname, "assets", "logosynapse.png"),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.loadFile("index.html");

    const menu = Menu.buildFromTemplate(createMenuTemplate());
    Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
    createWindow();
    

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
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
            sandbox: false,
            devTools: false
        }
    });
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.loadFile("index.html");

    const menu = Menu.buildFromTemplate(createMenuTemplate());
    Menu.setApplicationMenu(menu);
};

let popupWindow;
const createPopupWindow = () => {
    popupWindow = new BrowserWindow({
        width: 350,
        height: 345,
        alwaysOnTop: true,
        frame: false,
        modal: false,
        resizable: false,
        parent: mainWindow,
        backgroundColor: "#201E40",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: false
        }
    });
    popupWindow.loadFile("popup.html");

    // popupWindow.once("ready-to-show", () => {
    //     setTimeout(() => {
    //         if (popupWindow) {
    //             popupWindow.close();
    //         }
    //     }, 5000); // 5 seconds
    // });

    popupWindow.on('closed', () => {
        popupWindow = null;
    });
};

app.whenReady().then(() => {
    createWindow();
    // createPopupWindow();

    ipcMain.on("trigger-popup", () => {
    if (!popupWindow) createPopupWindow();
    });
    ipcMain.on('terminate-popup', () => {
        if(popupWindow){
            popupWindow.close();
        }
    });


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
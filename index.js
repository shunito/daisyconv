// jshint esversion:6

void function() {
    'use strict';
    const electron = require('electron');
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const path = require('path');
    const url = require('url');
    const redux = require('redux');
    const {ipcMain, dialog} = require('electron');
    const winston = require('winston');
    const objectAssign = require('object-assign');

    // Logging
    const userDataPath = app.getPath('userData');
    const logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: path.join(userDataPath,'log','app.log') })
      ]
    });
    global.logger = logger;

    let mainWindow;
    let daisyConv = {};

    daisyConv.app = app;
    daisyConv.log = logger;

    const render = () => {
        console.log( 'render' );
        mainWindow.webContents.send("render", {});
    };

    function createWindow() {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            fullscreen: 800,
            height: 600
        });

        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        // Open the DevTools.
        mainWindow.webContents.openDevTools();

        daisyConv.window = mainWindow;

        // Emitted when the window is closed.
        mainWindow.on('closed', function() {
            mainWindow = null;
        });

    }

    daisyConv.app.on('ready', createWindow);

    // Quit when all windows are closed.
    daisyConv.app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
            daisyConv.app.quit();
        }
    });

    daisyConv.app.on('activate', function() {
        if (mainWindow === null) {
            createWindow();
        }
    });


}();

// jshint esversion:6

void function() {
    'use strict';
    const electron = require('electron');
    const {ipcMain, dialog} = require('electron');
    const {shell} = require('electron');
    const path = require('path');
    const url = require('url');
    const redux = require('redux');
    const winston = require('winston');

    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;

    // App Store Manager
    const reducers = require('./src/reducers');
    const store = redux.createStore(reducers.rootReducer);
    const action = require('./src/actions');

    // Storage Modules
    const Projects = require('./src/modules/Projects');

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
//        console.log( 'render:state::' , store.getState() );
        mainWindow.webContents.send("render", store.getState());
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

        // Open Project List
        mainWindow.webContents.on("dom-ready", function(){
            action.loadProjects(store).then(function(){
                return action.viewProjects(store);
            }).then(function(){
                render();
            });
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

    ipcMain.on("dispatch-store", (sender, e) => {

        if( e.type === 'VIEW_DAISY_STATUS' ){
            action.getDAISY( store, e.value ).then(function(){
                return action.getEPUB( store, e.value );
            }).then(function( epub ){
                store.dispatch(e);
                render();
            });
        }
        else if( e.type === 'EPUB_CONFIG_UPDATE' ){
            action.updateEPUBConfig(store, e.id, e.value ).then(function( epub ){
                render();
            });
        }
        else{
            store.dispatch(e);
            render();
        }
    });

    ipcMain.on("convert-epub", (sender, e) => {
        if( e.type !== 'EPUB_BUILD_INIT'){
            return;
        }
        const id = e.value;
        action.viewLoading( store );
        render();

        action.convDAISYtoEPUB( store , id ).then(function(){
            console.log('-buid-');
            return action.selectMenu( store, 'daisy_status');
        }).then(function(){
            render();
        });
    });

    // Open DAISY File
    ipcMain.on("file-open", (sender, e) => {
        const file = e.files[0];
        action.viewLoading( store );
        render();

        action.loadDAISY( store, file ).then(function( daisy ){
            console.log( ' --1-- ');
            return action.addProject(store , daisy);
        }).then(function(  ){
            console.log( ' --2-- ');
            return action.loadProjects(store);
        }).then(function(){
            console.log( ' --3-- ');
            return action.viewProjects(store);
        }).then(function(){
            console.log( ' --4-- ');
            render();
        }).catch(function( err ){
            console.log( err );
            action.viewProjects(store).then(function(){
                render();
            });
        });

    });

    ipcMain.on("item-open", (sender, e) => {
        //console.log( e );
        const id = e.id;
        const dir = e.dir;
        shell.showItemInFolder(dir);
    });

}();

'use strict';

const electron = require('electron');
const _ = require('lodash');
const path = require('path');
const loopMenu = require(path.join(__dirname, 'menu.js'));
const fs = require("fs");
const storage = require('electron-json-storage');

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

let mainWindow;
let mainWindowLastTitle;

const platform = process.platform;

function makeDraggable() {
  mainWindow.webContents.insertCSS('paper-toolbar { -webkit-app-region: drag; }');
  mainWindow.webContents.insertCSS('paper-toolbar .gb_Ie.gb_T.gb_X { -webkit-app-region: no-drag; }');
  mainWindow.webContents.insertCSS('paper-toolbar #input { -webkit-app-region: no-drag; }');
  mainWindow.webContents.insertCSS('paper-toolbar paper-icon-button { -webkit-app-region: no-drag; }');
}

function stylePlayer() {
  var theme = fs.readFileSync(path.join(__dirname, 'themes', 'theme.css'), "utf8");

  mainWindow.webContents.insertCSS('#player paper-icon-button[data-id="show-miniplayer"] { display: none; }');
  mainWindow.webContents.insertCSS(theme);
}

function updateImage() {
  mainWindow.webContents.executeJavaScript("document.querySelector('.style-scope.gpm-detail-page-header img').src=''+document.querySelector('.style-scope.gpm-detail-page-header img').src.replace(/\=s.*?-c-/, '=s1024-c-')+'';");
}

app.on('ready', function () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(loopMenu.getMenuTemplate(app)));

  var windowWidth = 1280, windowHeight = 800;
  storage.get('windowSize')
  .then(function(data) {
    if(Object.keys(data).length > 0) {
      var size = JSON.parse(data);
      windowWidth = size[0];
      windowHeight = size[1];
    }
  })
  .then(function() {
    var options = {
      width: windowWidth,
      height: windowHeight,
      center: true,
      title: 'Play',
      titleBarStyle: 'hidden',
      // transparent: true,
      icon: path.join(__dirname, 'images', 'appicon.png'),
      acceptFirstMouse: true,
      webPreferences: {
        defaultFontSize: 14,
        defaultEncoding: 'UTF-8'
      }
    };

    if (process.platform.match(/^linux/)) {
      options.frame = false;
    }

    console.log(options);
    mainWindow = new BrowserWindow(options);
  })
  .then(function() {
    mainWindow.webContents.on('dom-ready', function() {
      stylePlayer();
      makeDraggable();
    });

    mainWindow.on('resize', function() {
      storage.set('windowSize', JSON.stringify(mainWindow.getSize()));
    });

    mainWindow.on('closed', function() {
      mainWindow = null;
    });

    mainWindow.webContents.on('did-navigate-in-page', function() {
      setTimeout(function(){ updateImage(); }, 1000);
    });
  })
  .then(function() {
    mainWindow.loadURL('https://play.google.com/music/listen#/recents');
  })
  .then(function() {
    globalShortcut.register('MediaPlayPause', function() {
      mainWindow.webContents.executeJavaScript('document.querySelector(\'paper-icon-button[data-id="play-pause"]\').click();');
    });

    globalShortcut.register('MediaNextTrack', function() {
      mainWindow.webContents.executeJavaScript('document.querySelector(\'paper-icon-button[data-id="forward"]\').click();');
    });

    globalShortcut.register('MediaPreviousTrack', function() {
      mainWindow.webContents.executeJavaScript('document.querySelector(\'paper-icon-button[data-id="rewind"]\').click();');
    });

    globalShortcut.register('F4', function() {
      mainWindow.webContents.executeJavaScript('document.querySelector(\'.style-scope.gpm-detail-page-header\').click();');
    });

    globalShortcut.register('F5', function() {
      mainWindow.webContents.goBack();
    });

    globalShortcut.register('F6', function() {
      mainWindow.webContents.executeJavaScript('document.querySelector(\'[data-id="auto-playlist-thumbs-up"]\').click();');
    });

  });
});

app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') {
    app.quit();
  // }
});

app.on('activate', function () {
  if (mainWindow === null) {
    app.quit();
  }
});


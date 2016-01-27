'use strict';

const electron = require('electron');
const _ = require('lodash');
const path = require('path');
const loopMenu = require(path.join(__dirname, 'menu.js'));
const fs = require("fs");

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

let mainWindow;
let mainWindowLastTitle;

const platform = process.platform;

function makeDraggable() {
  if (platform == 'linux') {
      mainWindow.webContents.insertCSS('paper-toolbar { -webkit-app-region: drag; }');
      mainWindow.webContents.insertCSS('paper-toolbar .gb_Ie.gb_T.gb_X { -webkit-app-region: no-drag; }');
      mainWindow.webContents.insertCSS('paper-toolbar #input { -webkit-app-region: no-drag; }');
      mainWindow.webContents.insertCSS('paper-toolbar paper-icon-button { -webkit-app-region: no-drag; }');
      }
}

function stylePlayer() {
  var theme = fs.readFileSync(path.join(__dirname, 'themes', 'theme.css'), "utf8");

  mainWindow.webContents.insertCSS('#player paper-icon-button[data-id="show-miniplayer"] { display: none; }');
  mainWindow.webContents.insertCSS(theme);
}

function triggerNotification(_content) {
  if (mainWindow.isFocused()) return;
  mainWindow.webContents.executeJavaScript('new Notification("' + _content.title + '", { body: "' + _content.body + '"});');
}

app.on('ready', function () {
  Menu.setApplicationMenu(Menu.buildFromTemplate(loopMenu.getMenuTemplate(app)));

  var options   = {
    width: 1000,
    height: 800,
    center: true,
    title: 'Loop',
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

    mainWindow = new BrowserWindow(options);

  mainWindow.loadURL('https://play.google.com/music/listen');

  mainWindow.webContents.on('dom-ready', function() {
    mainWindow.webContents.executeJavaScript('Notification.requestPermission();');
    stylePlayer();

    makeDraggable();
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.on('page-title-updated', function() {
    var windowTitle = mainWindow.getTitle();

    if(typeof windowTitle === "undefined" || windowTitle === null || _.trim(windowTitle).trim() === "" || windowTitle === mainWindowLastTitle) return;

    var ignoreTitles = [/^listen.{0,1}now.{0,10}google.{0,1}play.{0,1}music$/i, /^loop$/i, /^google.{0,1}play.{0,1}music$/i];
    for(var i = 0; i < ignoreTitles.length; i++) {
      if (ignoreTitles[i].exec(windowTitle) !== null) return;
    }

    console.log("Last: " + mainWindowLastTitle);
    mainWindowLastTitle = windowTitle;
    console.log("Current: " + windowTitle);

    var titleRegex = /^(.+) - (.+) - Google Play Music$/;
    var m;

    if ((m = titleRegex.exec(windowTitle)) !== null) {
      triggerNotification({ title: m[2], body: m[1] });
    }
  });

  globalShortcut.register('MediaPlayPause', function() {
    mainWindow.webContents.executeJavaScript('document.querySelector(\'paper-icon-button[data-id="play-pause"]\').click();');
  });

  globalShortcut.register('MediaNextTrack', function() {
    mainWindow.webContents.executeJavaScript('document.querySelector(\'paper-icon-button[data-id="forward"]\').click();');
  });

  globalShortcut.register('MediaPreviousTrack', function() {
    mainWindow.webContents.executeJavaScript('document.querySelector(\'paper-icon-button[data-id="rewind"]\').click();');
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


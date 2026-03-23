const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    titleBarStyle: 'hidden', // Modern glass appearance
    titleBarOverlay: {
      color: '#0D0E0E',
      symbolColor: '#C8B6A9',
      height: 30
    },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#0D0E0E',
    show: false, // Performance: show only after load
    icon: path.join(__dirname, '../public/logo.png')
  });

  // Center window on start
  mainWindow.center();

  const url = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../.next/server/pages/index.html')}`; // Fallback for production builds

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Pro-Feature: Open external links in real browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

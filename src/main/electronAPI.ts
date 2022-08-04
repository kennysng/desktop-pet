import { app, BrowserWindow, ipcMain } from "electron";
import { lstat } from 'fs/promises';
import { resolve } from "path";
import { IConfig, IPet } from "../interface";

async function loadPet(name: string): Promise<IPet> {
  const appPath = app.getAppPath();
  let petPath = resolve(appPath, 'pets', name);
  try {
    lstat(petPath);
    return require(resolve(petPath, 'index.json'));
  }
  catch (e) {
    try {
      const docPath = app.getPath('documents');
      petPath = resolve(docPath, 'desktop-pets', name);
      lstat(petPath);
      return require(resolve(petPath, 'index.json'));
    }
    catch (e) {
      // TODO
    }
  }
}

export default async (mainWindow: BrowserWindow) => {
  ipcMain.on('set-window-position', (event, { x, y }) => {
    mainWindow.setPosition(x, y);
  });

  ipcMain.on('set-window-size', (event, { w, h }) => {
    mainWindow.setSize(w, h);
  });

  const configPath = resolve(app.getPath('userData'), 'config.config');
  let config: IConfig;
  try {
    lstat(configPath);
    config = JSON.parse(require(configPath));
  }
  catch (e) {
    config = {};
  }

  mainWindow.webContents.send('get-pet', await loadPet(config.pet || 'cat'));
}

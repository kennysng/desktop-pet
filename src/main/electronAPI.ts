import { app, BrowserWindow, ipcMain } from "electron";
import { readFile, lstat } from 'fs/promises';
import { resolve } from "path";
import { parse } from 'yaml';
import { IConfig } from "./interface";

export default async (mainWindow: BrowserWindow) => {
  ipcMain.on('set-window-position', (event, { x, y }) => {
    mainWindow.setPosition(x, y);
  });

  ipcMain.on('set-window-size', (event, { w, h }) => {
    mainWindow.setSize(w, h);
  });

  const configPath = resolve(app.getPath('userData'), 'config.yaml')
  let config: IConfig
  try {
    lstat(configPath)
    config = parse(await readFile(configPath, 'utf8'));
  }
  catch (e) {
    config = {}
  }

  mainWindow.webContents.send('get-pet', config.pet || 'cat');
}

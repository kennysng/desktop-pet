import { app, BrowserWindow, ipcMain } from 'electron';
import { lstat } from 'fs/promises';
import { resolve } from 'path';
import { IPet } from '../interface';
import { Config } from './config';

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

export default async (mainWindow: BrowserWindow, config: Config) => {
  // get app config
  ipcMain.handle('get-config', async () => ({ result: config.toJson() }));

  // when pet move
  ipcMain.handle('set-window-position', (event, { x, y }) => {
    mainWindow.setPosition(x, y);
    return { result: true };
  });

  mainWindow.webContents.send('pet', await loadPet(config.pet));
}

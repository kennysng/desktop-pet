import { BrowserWindow, ipcMain } from "electron";

module.exports = (mainWindow: BrowserWindow) => {
  ipcMain.on('set-window-position', (event, { x, y }) => {
    mainWindow.setPosition(x, y);
  });

  ipcMain.on('set-window-size', (event, { w, h }) => {
    mainWindow.setSize(w, h);
  });
}

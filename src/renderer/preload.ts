// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  setWindowPosition: (position: { x: number; y: number }) => ipcRenderer.send('set-window-position', position),
  setWindowSize: (size: { w: number; h: number }) => ipcRenderer.send('set-window-size', size),
});

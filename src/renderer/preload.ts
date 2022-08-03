// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IPet } from '../main/interface';

contextBridge.exposeInMainWorld('electronAPI', {
  getPet: (callback: (e: Event, pet: string) => IPet) => ipcRenderer.on('get-pet', callback),
  setWindowPosition: (position: { x: number; y: number }) => ipcRenderer.send('set-window-position', position),
  setWindowSize: (size: { w: number; h: number }) => ipcRenderer.send('set-window-size', size),
});

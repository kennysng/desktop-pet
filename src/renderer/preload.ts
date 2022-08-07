// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { InvalidResultError } from '../errors';
import { IConfig, IPet, IResult, MyError } from '../interface';

type MyResult<T> = Promise<IResult<T>>

async function handleResult<T>(promise: MyResult<T>) {
  const result = await promise;
  if ('error' in result) {
    throw new MyError(result);
  } else if ('result' in result) {
    return result.result;
  } else {
    throw InvalidResultError;
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  setWindowPosition: (position: { x: number; y: number }) => handleResult<boolean>(ipcRenderer.invoke('set-window-position', position)),
  setWindowSize: (size: { w: number; h: number }) => handleResult<boolean>(ipcRenderer.invoke('set-window-size', size)),
  getConfig: () => handleResult<IConfig>(ipcRenderer.invoke('get-config')),
  setPet: (name: string) => handleResult<IPet>(ipcRenderer.invoke('set-pet', name)),
});

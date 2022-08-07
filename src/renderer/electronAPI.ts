import { IConfig, IPet } from '../interface';

declare global {
  interface Window {
    electronAPI: {
      setWindowPosition(position: { x: number; y: number }): Promise<boolean>;
      setWindowSize(size: { w: number; h: number }): Promise<boolean>;
      getConfig(): Promise<IConfig>;
      setPet(name: string): Promise<IPet>;
    }
  }
}

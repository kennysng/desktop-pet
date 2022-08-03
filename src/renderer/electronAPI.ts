import { IPet } from "../main/interface";

declare global {
  interface Window {
    electronAPI: {
      getPet(callback: (pet: string) => IPet): void;
      setWindowPosition(position: { x: number; y: number }): void;
      setWindowSize(size: { w: number; h: number }): void;
    }
  }
}

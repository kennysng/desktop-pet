import { IPet } from "../interface";

declare global {
  interface Window {
    electronAPI: {
      getPet(callback: (pet: IPet) => void): void;
      setWindowPosition(position: { x: number; y: number }): void;
      setWindowSize(size: { w: number; h: number }): void;
    }
  }
}

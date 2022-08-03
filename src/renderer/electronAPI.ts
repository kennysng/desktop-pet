interface Window {
  electronAPI: {
    getPet(callback: (pet: string) => void): void;
    setWindowPosition(position: { x: number; y: number }): void;
    setWindowSize(size: { w: number; h: number }): void;
  };
}

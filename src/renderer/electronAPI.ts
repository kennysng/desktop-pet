interface Window {
  electronAPI: {
    setWindowPosition(position: { x: number; y: number }): void;
    setWindowSize(size: { w: number; h: number }): void;
  };
}
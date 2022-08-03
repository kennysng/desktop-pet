import { Application } from 'pixi.js';

export class DesktopPet {
  private app?: Application;

  start(pet: string) {
    const app = this.app = new Application({ resolution: devicePixelRatio, resizeTo: window });
    document.body.appendChild(app.view);

    // TODO load json
  }

  destroy() {
    this.app.destroy()
    this.app = undefined;
  }
}
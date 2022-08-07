import { Application } from 'pixi.js';
import { IPet } from '../../interface';

export class DesktopPet {
  private app?: Application;

  start(pet: IPet) {
    const app = this.app = new Application({ resolution: devicePixelRatio, resizeTo: window });
    document.body.appendChild(app.view);
    return this;
  }

  destroy() {
    this.app.destroy()
    this.app = undefined;
    return this;
  }
}

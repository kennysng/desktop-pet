import { Application } from 'pixi.js';
import { IPet } from '../../main/interface';

export class DesktopPet {
  private app?: Application;

  start(pet: IPet) {
    const app = this.app = new Application({ resolution: devicePixelRatio, resizeTo: window });
    document.body.appendChild(app.view);
  }

  destroy() {
    this.app.destroy()
    this.app = undefined;
  }
}
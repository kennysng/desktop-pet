import { ISpritesheetData } from "pixi.js";

export interface IConfig {
  pet?: string;
}

export interface ISpritesheet {
  path: string;
  data: ISpritesheetData;
}

export interface IPet {
  scriptPath: string;
  spritesheets: ISpritesheet[];
}

import { app } from "electron";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { IConfig } from "../interface";

const defaultConfig: IConfig = {
  pet: 'cat'
  // TODO
}

export class Config extends IConfig {
  private readonly path: string;

  constructor() {
    super();
    this.path = resolve(app.getPath('userData'), 'config.config');
  }

  async load() {
    const config: IConfig = existsSync(this.path) ? JSON.parse(require(this.path)) : defaultConfig;
    Object.assign(this, config, defaultConfig);
    return this;
  }

  async update() {
    await writeFile(this.path, JSON.stringify(this.toJson(), null, 2), 'utf8');
  }

  toJson(): IConfig {
    return {
      pet: this.pet
    };
  }
}
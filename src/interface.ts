import { ISpritesheetData } from 'pixi.js';

export class MyError extends Error {
  constructor(private readonly result: IFailResult) {
    super(result.error);
  }

  get code() {
    return this.result.code;
  }
}

export abstract class IConfig {
  pet: string;
}

export interface ISpritesheet {
  path: string;
  data: ISpritesheetData;
}

export interface IPet {
  scriptPath: string;
  spritesheets: ISpritesheet[];
}

export type IResult<T> = ISuccessResult<T> | IFailResult;

export interface ISuccessResult<T> {
  result: T;
}

export interface IFailResult {
  code: string;
  error: string;
}

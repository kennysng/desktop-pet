import { ISpritesheetData } from 'pixi.js';
import { LogMode } from './main/logger';

export enum LogType {
  VERBOSE = 'verbose',
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface Log {
  type: LogType;
  indent?: number;
  group?: string;
  message: string;
  stack?: string;
  createdAt: string;
}

export class MyError extends Error {
  constructor(private readonly result: IFailResult) {
    super(result.error);
  }

  get code() {
    return this.result.code;
  }
}

export abstract class IConfig {
  console?: boolean;
  log?: LogMode;
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

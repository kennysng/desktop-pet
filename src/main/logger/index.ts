import { LogType } from "../../interface";
import { cleanObj } from "../../utils";
import { markdownTable } from 'markdown-table';
import { format, InspectOptions } from "util";
import { Log, SqliteLogger } from "./SqliteLogger";
import { FileLogger } from "./FileLogger";

export enum LogMode {
  console = 'console',
  sqlite = 'sqlite',
  file = 'file',
}

const loggers: Record<LogMode, Console> = {
  [LogMode.console]: console,
  [LogMode.sqlite]: new SqliteLogger(),
  [LogMode.file]: new FileLogger(),
}

export class Logger implements Console {
  constructor(private readonly modes: LogMode[] = []) {}

  get loggers() {
    if (!this.modes) return [loggers[LogMode.file]];
    return this.modes.map(mode => loggers[mode]);
  }

  // @override
  assert(condition?: boolean, ...data: any[]): void;
  assert(value: any, message?: string, ...optionalParams: any[]): void;
  assert(value?: any, message?: string, ...optionalParams: any[]) {
    for (const logger of this.loggers) {
      logger.assert(value, message, ...optionalParams);
    }
  }

  // @override
  clear() {
    for (const logger of this.loggers) {
      logger.clear();
    }
  }

  // @override
  count(label?: string) {
    for (const logger of this.loggers) {
      logger.count(label);
    }
  }

  // @override
  countReset(label = 'default') {
    for (const logger of this.loggers) {
      logger.countReset(label);
    }
  }

  // @override
  debug(message?: any, ...optionalParams: any[]) {
    for (const logger of this.loggers) {
      logger.debug(message, ...optionalParams);
    }
  }

  // @override
  dir(obj: any, options?: InspectOptions) {
    for (const logger of this.loggers) {
      logger.dir(obj, options);
    }
  }

  // @override
  dirxml(...data: any[]) {
    for (const logger of this.loggers) {
      logger.dirxml(...data);
    }
  }

  // @override
  error(message?: any, ...optionalParams: any[]) {
    for (const logger of this.loggers) {
      logger.error(message, ...optionalParams);
    }
  }

  // @override
  group(...labels: string[]) {
    for (const logger of this.loggers) {
      logger.group(labels);
    }
  }

  // @override
  groupCollapsed(...labels: string[]) {
    for (const logger of this.loggers) {
      logger.groupCollapsed(labels);
    }
  }

  // @override
  groupEnd() {
    for (const logger of this.loggers) {
      logger.groupEnd();
    }
  }
}

class Logger2 implements Console {
  private static readonly queue: Log[] = [];
  private static readonly counter: Record<string, number> = {};
  private static readonly timer: Record<string, number> = {};
  private static readonly groups: string[] = [];

  public readonly Console = console.Console;

  constructor(debugMode: boolean);
  constructor(
    private readonly debugMode: boolean,
    private readonly queue = Logger.queue,
    private readonly counter = Logger.counter,
    private readonly timer = Logger.timer,
    private readonly groups = Logger.groups,
  ) {}

  private _log(type: LogType, message?: any, ...optionalParams: any[]) {
    const stack = type === LogType.ERROR ? optionalParams[0] : undefined;
    if (type === LogType.ERROR) optionalParams = optionalParams.slice(1);
    message = format(message, ...optionalParams)
    this.queue.push({ type, indent: this.groups.length, group: this.groups[this.groups.length - 1], message, stack });
  }

  assert(condition?: boolean, ...data: any[]): void;
  assert(value: any, message?: string, ...optionalParams: any[]): void;
  assert(value?: any, message?: any, ...optionalParams: any[]): void {
    if (!value) {
      if (this.debugMode) console.assert(value, message, ...optionalParams);
      message = `Assertion failed: ${message}`;
      const error = new Error(message);
      this._log(LogType.ERROR, message, error.stack, ...optionalParams);
    }
  }

  clear(): void {
    if (this.debugMode) console.clear();
    cleanObj(this.queue);
  }

  count(label = 'default') {
    if (!this.counter[label]) this.counter[label] = 0;
    this.counter[label] += 1;
    this.log(`${label}: ${this.counter[label]}`);
  }

  countReset(label = 'default') {
    if (this.debugMode) console.countReset(label);
    delete this.counter[label];
  }

  debug(message?: any, ...optionalParams: any[]) {
    this.log(message, ...optionalParams);
  }

  dir(obj: any, options?: InspectOptions) {
    if (this.debug) console.dir(obj, options);
  }

  dirxml(...data: any[]) {
    if (this.debug) console.dirxml(...data);
  }

  error(message?: any, ...optionalParams: any[]) {
    if (this.debugMode) console.error(message, ...optionalParams);
    this._log(LogType.ERROR, message, ...optionalParams);
  }

  group(label?: string) {
    if (this.debugMode) console.group(label);
    this.groups.push(label);
  }

  groupCollapsed(label: string) {
    if (this.debugMode) console.groupCollapsed(label);
  }

  groupEnd() {
    if (this.debugMode) console.groupEnd();
    this.groups.pop();
  }

  info(message?: any, ...optionalParams: any[]) {
    if (this.debugMode) console.info(message, ...optionalParams);
    this._log(LogType.INFO, message, ...optionalParams);
  }

  log(message?: any, ...optionalParams: any[]) {
    if (this.debugMode) console.log(message, ...optionalParams);
    this._log(LogType.LOG, message, ...optionalParams);
  }

  profile(label?: string): void {
    if (this.debugMode) console.profile(label);
  }

  profileEnd(label?: string): void {
    if (this.debugMode) console.profileEnd(label);
  }

  table(data: any, columns?: string[]) {
    if (this.debugMode) console.table(data, columns);
    let message: string
    if (Array.isArray(data)) {
      columns = ['(index)', 'Values'];
      message = markdownTable([columns, ...data.map((v, i) => [i, v])]);
    } else if (typeof data === 'object') {
      const keys = Object.keys(message);
      if (!columns) columns = keys;
      columns = ['(index)', ...columns];
      message = markdownTable([columns, ...data.map((v: any, i: number) => columns.reduce((r, k) => [...r, v[k]], [i]))]);
    } else {
      columns = ['(index)', 'Value'];
      message = markdownTable([columns, [0, data]]);
    }
    this._log(LogType.LOG, message);
  }

  time(label: string) {
    if (this.debugMode) console.time(label);
    this.timer[label] = Date.now();
  }

  timeEnd(label: string) {
    if (this.debugMode) console.timeEnd(label);
    if (!this.timer[label]) this._log(LogType.ERROR, `Timer "${label}" doesn't exist.`);
    const elapsed = Date.now() - this.timer[label];
    this._log(LogType.LOG, `${label}: ${elapsed}ms - timer ended`);
  }

  timeLog(label: string) {
    if (this.debugMode) console.timeLog(label);
    if (!this.timer[label]) this._log(LogType.ERROR, `Timer "${label}" doesn't exist.`);
    const elapsed = Date.now() - this.timer[label];
    this._log(LogType.LOG, `${label}: ${elapsed}ms`);
  }

  timeStamp(label: string) {
    if (this.debugMode) console.timeStamp(label);
  }

  trace(message?: any, ...optionalParams: any[]) {
    if (this.debugMode) console.trace(message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]) {
    if (this.debugMode) console.warn(message, ...optionalParams);
    this._log(LogType.WARN, message, ...optionalParams);
  }
}

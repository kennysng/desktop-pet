import { IConfig } from "../../interface";
import { InspectOptions } from "util";
import { SqliteLogger } from "./SqliteLogger";
import { FileLogger } from "./FileLogger";

export enum LogMode {
  default = 'default',
  console = 'console',
  sqlite = 'sqlite',
  file = 'file',
}

const loggers: { [key: string]: Console } = {};

export class Logger implements Console {
  // singleton
  private static instance: Logger;

  public readonly Console = console.Console;

  constructor(private readonly config: IConfig) {
    if (!Logger.instance) {
      loggers[LogMode.default] = new FileLogger(config, true);
      loggers[LogMode.console] = console;
      loggers[LogMode.sqlite] = new SqliteLogger(config);
      loggers[LogMode.file] = new FileLogger(config);
      Logger.instance = this;
    }
    return Logger.instance;
  }

  get modes() {
    const modes: LogMode[] = [];
    if (this.config.console) modes.push(LogMode.console);
    if (this.config.log) modes.push(this.config.log);
    if (!modes.length) modes.push(LogMode.default);
    return modes;
  }

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

  // @override
  info(message?: any, ...optionalParams: any[]) {
    for (const logger of this.loggers) {
      logger.info(message, ...optionalParams);
    }
  }

  // @override
  log(message?: any, ...optionalParams: any[]) {
    for (const logger of this.loggers) {
      logger.log(message, ...optionalParams);
    }
  }

  // @override
  profile(label?: string): void {
    for (const logger of this.loggers) {
      logger.profile(label);
    }
  }

  // @override
  profileEnd(label?: string): void {
    for (const logger of this.loggers) {
      logger.profileEnd(label);
    }
  }

  // @override
  table(data: any, columns?: string[]) {
    for (const logger of this.loggers) {
      logger.table(data, columns);
    }
  }

  // @override
  time(label: string) {
    for (const logger of this.loggers) {
      logger.time(label);
    }
  }

  // @override
  timeEnd(label: string) {
    for (const logger of this.loggers) {
      logger.timeEnd(label);
    }
  }

  // @override
  timeLog(label: string) {
    for (const logger of this.loggers) {
      logger.timeLog(label);
    }
  }

  // @override
  timeStamp(label: string) {
    for (const logger of this.loggers) {
      logger.timeStamp(label);
    }
  }

  // @override
  trace(message?: any, ...optionalParams: any[]) {
    for (const logger of this.loggers) {
      logger.trace(message, ...optionalParams);
    }
  }

  // @override
  warn(message?: any, ...optionalParams: any[]) {
    for (const logger of this.loggers) {
      logger.warn(message, ...optionalParams);
    }
  }
}

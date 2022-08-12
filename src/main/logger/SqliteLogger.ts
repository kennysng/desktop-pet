import { cleanObj } from '../../utils';
import { format, InspectOptions } from 'util';
import { IConfig, Log, LogType } from '../../interface';
import { markdownTable } from 'markdown-table';
import sqlite from 'sqlite3'
import { resolve } from 'path';
import { app } from 'electron';

let sqlite_ = sqlite;

export function sqliteVerbose() {
  sqlite_ = sqlite_.verbose()
}

export class SqliteLogger implements Console {
  private static timeout?: NodeJS.Timeout;
  private static isRunning = false;
  private static readonly queue: Log[] = [];
  private static readonly counter: Record<string, number> = {};
  private static readonly timer: Record<string, number> = {};
  private static readonly groups: string[] = [];

  private static write() {
    const logPath = resolve(app.getPath('logs'), 'log.sqlite3');
    const db = new sqlite.Database(logPath);
    db.on('error', e => console.error(`Sqlite Error: ${e.message}`));
    db.serialize(() => {
      // create table
      db.run(`CREATE TABLE \`log\` IF NOT EXISTS (
        \`id\` INTEGER PRIMARY KEY AUTO_INCREMENT,
        \`type\` TEXT,
        \`indent\` INTEGER DEFAULT 0,
        \`group\` TEXT,
        \`message\` TEXT,
        \`stack\` TEXT,
        \`createdAt\` TEXT
      )`);

      // insert logs
      let values = '';
      for (const log of this.queue) {
        const { type, indent, group, message, stack, createdAt } = log;
        values += `('${type}', ${indent || 0}, ${group ? `'${group}'` : 'NULL'}, '${message}', ${stack ? `'${stack}'` : 'NULL'}, '${createdAt}')`;
        if (log !== this.queue[this.queue.length - 1]) values += ', '
      }
      db.run(`INSERT INTO \`log\` (\`type\`, \`indent\`, \`group\`, \`message\`, \`stack\`, \`createdAt\`) VALUES ${values}`);
    })
    db.close();
  }

  private static addToQueue(log: Log) {
    this.queue.push(log);
    if (!this.isRunning) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }
      this.timeout = setTimeout(() => {
        this.timeout = undefined;
        this.isRunning = true;
        this.write();
        this.isRunning = false;
      }, 10000);
    }
  }

  public readonly Console = console.Console;

  constructor(config: IConfig);
  constructor(
    config: IConfig,
    private readonly queue = SqliteLogger.queue,
    private readonly counter = SqliteLogger.counter,
    private readonly timer = SqliteLogger.timer,
    private readonly groups = SqliteLogger.groups,
  ) {}

  private _log(type: LogType, message?: any, ...optionalParams: any[]) {
    const stack = type === LogType.ERROR ? optionalParams[0] : undefined;
    if (type === LogType.ERROR) optionalParams = optionalParams.slice(1);
    message = format(message, ...optionalParams)
    SqliteLogger.addToQueue({
      type,
      indent: this.groups.length,
      group: this.groups[this.groups.length - 1],
      message,
      stack,
      createdAt: new Date().toISOString(),
    });
  }

  // @override
  assert(condition?: boolean, ...data: any[]): void;
  assert(value: any, message?: string, ...optionalParams: any[]): void;
  assert(value?: any, message?: any, ...optionalParams: any[]): void {
    if (!value) {
      message = `Assertion failed: ${message}`;
      const error = new Error(message);
      this._log(LogType.ERROR, message, error.stack, ...optionalParams);
    }
  }

  // @override
  clear(): void {
    cleanObj(this.queue);
  }

  // @override
  count(label = 'default') {
    if (!this.counter[label]) this.counter[label] = 0;
    this.counter[label] += 1;
    this.log(`${label}: ${this.counter[label]}`);
  }

  // @override
  countReset(label = 'default') {
    delete this.counter[label];
  }

  // @override
  debug(message?: any, ...optionalParams: any[]) {
    this.log(message, ...optionalParams);
  }

  // @override
  dir(obj: any, options?: InspectOptions) {
    if (this.debug) console.dir(obj, options);
  }

  // @override
  dirxml(...data: any[]) {
    if (this.debug) console.dirxml(...data);
  }

  // @override
  error(message?: any, ...optionalParams: any[]) {
    this._log(LogType.ERROR, message, ...optionalParams);
  }

  // @override
  group(label?: string) {
    this.groups.push(label);
  }

  // @override
  groupCollapsed(label: string) {}

  // @override
  groupEnd() {
    this.groups.pop();
  }

  // @override
  info(message?: any, ...optionalParams: any[]) {
    this._log(LogType.INFO, message, ...optionalParams);
  }

  // @override
  log(message?: any, ...optionalParams: any[]) {
    this._log(LogType.LOG, message, ...optionalParams);
  }

  // @override
  profile(label?: string): void {}

  // @override
  profileEnd(label?: string): void {}

  // @override
  table(data: any, columns?: string[]) {
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

  // @override
  time(label: string) {
    this.timer[label] = Date.now();
  }

  // @override
  timeEnd(label: string) {
    if (!this.timer[label]) this._log(LogType.ERROR, `Timer "${label}" doesn't exist.`);
    const elapsed = Date.now() - this.timer[label];
    this._log(LogType.LOG, `${label}: ${elapsed}ms - timer ended`);
  }

  // @override
  timeLog(label: string) {
    if (!this.timer[label]) this._log(LogType.ERROR, `Timer "${label}" doesn't exist.`);
    const elapsed = Date.now() - this.timer[label];
    this._log(LogType.LOG, `${label}: ${elapsed}ms`);
  }

  // @override
  timeStamp(label: string) {}

  // @override
  trace(message?: any, ...optionalParams: any[]) {}

  // @override
  warn(message?: any, ...optionalParams: any[]) {
    this._log(LogType.WARN, message, ...optionalParams);
  }
}

import sqlite from 'sqlite3';
import { format } from 'util';

let sqlite_ = sqlite;

export function sqliteVerbose() {
  sqlite_ = sqlite_.verbose()
}

enum LogType {
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

interface Log {
  type: LogType;
  message: string;
  stack?: string;
}

export class Logger implements Console {
  private static readonly queue: Log[] = []

  constructor(debug: boolean, verbose: boolean);
  constructor(
    private readonly debug: boolean,
    private readonly verbose: boolean,
    private readonly queue = Logger.queue,
  ) {}

  assert(condition?: boolean, ...data: any[]): void;
  assert(value: any, message?: string, ...optionalParams: any[]): void;
  assert(value?: any, message?: any, ...optionalParams: any[]): void {
    if (!value) {
      message = message ? format(`Assertion failed: ${message}`, ...optionalParams) : 'Assertion failed';
      const error = new Error(message);
      if (this.debug) console.error(error.message, error.stack);
      this.queue.push({ type: LogType.ERROR, message, stack: error.stack });
    }
  }

  clear(): void {
    if (this.debug) console.clear();
    this.queue.length = 0;
  }
}
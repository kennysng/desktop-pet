import { LogType } from '../../interface';

export interface Log {
  type: LogType;
  indent?: number;
  group?: string;
  message: string;
  stack?: string;
}

export class SqliteLogger implements Console {
  public readonly Console = console.Console;

  // TODO
}

import { MyError } from './interface'

type Code = 'E000' | 'E001' | 'E100';

export const Errors: Record<Code, string> = {
  E000: 'Unknown error',
  E001: 'Invalid result format',
  E100: 'Fail to set pet',
};

export class MyError_ extends MyError {
  constructor(code: Code) {
    super({ code, error: Errors[code] });
  }
}

export const UnknownError = new MyError_('E000');

export const InvalidResultError = new MyError_('E001');

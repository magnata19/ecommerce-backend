import { ErrorCode, HttpException } from "./exception-root";

export class IncorrectPasswordException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
  }
}
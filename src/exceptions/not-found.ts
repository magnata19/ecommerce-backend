import { ErrorCode, HttpException } from "./exception-root";

export class NotFoundException extends HttpException {
  constructor(message: string, erroCode: ErrorCode) {
    super(message, erroCode, 400, null)
  }
}
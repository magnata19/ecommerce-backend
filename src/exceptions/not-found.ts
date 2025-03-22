import { ErrorCode, HttpException } from "./exception-root";

export class NotFoundException extends HttpException {
  constructor(message: string, erroCode: ErrorCode, error: any) {
    super(message, erroCode, 400, error)
  }
}
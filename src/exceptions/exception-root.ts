export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: any) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 404,
  USER_ALREADY_EXISTS = 404,
  UNAUTHORIZED = 402,
  INCORRECT_PASSWORD = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_EXCEPTION = 500,
  PRODUCT_NOT_FOUND = 404
}
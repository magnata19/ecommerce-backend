import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/exception-root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad-request";
import { UnprocessableEntity } from "./exceptions/unprocessable-entity";

export const ErrorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await method(req, res, next);
    } catch (err: any) {
      let exception: HttpException;
      if (err instanceof HttpException) {
        exception = err;
      } else {
        if (err instanceof ZodError) {
          exception = new UnprocessableEntity("Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY, err);
        } else {
          exception = new InternalException('Something went wrong!', err.message, ErrorCode.INTERNAL_EXCEPTION)
        }
      }
      next(exception)
    }
  }
}
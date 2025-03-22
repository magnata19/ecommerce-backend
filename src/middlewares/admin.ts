import { Request, Response, NextFunction } from "express";
import { RequestCustom } from "../types";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/exception-root";

export const adminMiddleware = (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    if (user?.role == "ADMIN") {
      next()
    }
  } catch (err) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED, err))
  }
}
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/exception-root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secret";
import { prismaClient } from "..";
import { RequestCustom } from "../types";

export const authMiddleware = async (req: RequestCustom, res: Response, next: NextFunction): Promise<any> => {
  // 1 - extract token from header
  const token = req.headers.authorization;
  // 2 - verify if the token is valid, if is not, throw a new exception
  if (!token) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
  }
  try {
    // 3 - if token is valid, extract the payload from token 
    const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any;
    // 4 - to get the user from the payload
    const user = await prismaClient.user.findFirst({ where: { id: payload.userId } })
    if (!user) {
      throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
    }
    // 5 - to attach the user to the current request object
    req.user = user;
    next();
  } catch (err) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
  }
}


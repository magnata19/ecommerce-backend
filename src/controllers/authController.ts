import { User } from "@prisma/client";
import e, { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secret";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/exception-root";
import { UnprocessableEntity } from "../exceptions/unprocessable-entity";
import { SignUpSchema } from "../schema/user-schema";
import { NotFoundException } from "../exceptions/not-found";
import { IncorrectPasswordException } from "../exceptions/incorrect-password";

export class AuthController {
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body);
    const { name, email, password } = req.body as User;

    let user = await prismaClient.user.findFirst({ where: { email: email } });

    if (user) {
      new BadRequestException('User already exists.', ErrorCode.USER_ALREADY_EXISTS);
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10)
      }
    })
    res.status(201).json(user)
  }

  static login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as User;
    let user = await prismaClient.user.findFirst({ where: { email: email } });
    if (!user) {
      throw new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND);
    }
    if (!compareSync(password, user.password)) {
      throw new IncorrectPasswordException("Incorrect password.", ErrorCode.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({
      userId: user.id,
    }, JWT_SECRET)

    res.status(200).json({ user, token });
  }

}
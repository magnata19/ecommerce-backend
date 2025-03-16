import { User } from "@prisma/client";
import e, { Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secret";

export class AuthController {
  static signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body as User;

    let user = await prismaClient.user.findFirst({ where: { email: email } });

    if (user) {
      throw new Error("User already exists.");
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

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body as User;
    let user = await prismaClient.user.findFirst({ where: { email: email } });
    if (!user) {
      throw new Error("User not found!")
    }
    if (!compareSync(password, user.password)) {
      throw new Error("Incorrect password.")
    }

    const token = jwt.sign({
      userId: user.id,
    }, JWT_SECRET)

    res.status(200).json({ user, token });
  }

}
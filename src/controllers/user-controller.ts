import { NextFunction, Request, Response } from "express";
import { AddressSchema } from "../schema/user-schema";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/exception-root";
import { prismaClient } from "..";
import { User } from "@prisma/client";
import { RequestCustom } from "../types";

export class UserController {
  static addAddress = async (req: RequestCustom, res: Response, next: NextFunction) => {
    AddressSchema.parse(req.body);
    try {
      const address = await prismaClient.address.create({
        data: {
          ...req.body,
          userId: req.user!.id
        }
      })
      res.json(address)
    } catch (err) {
      next(new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND, err))
    }

  }

  static deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prismaClient.address.delete({
        where: { id: +req.params.id }
      })
      res.json({ message: "Address deleted!", success: true })
    } catch (err) {
      next(new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND, err))
    }
  }

  static listAddress = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      const adresses = await prismaClient.address.findMany({
        where: { userId: req.user!.id }
      })
      res.json(adresses)
    } catch (err) {
      next(new NotFoundException("Addresses not found!", ErrorCode.ADDRESS_NOT_FOUND, err))
    }
  }
}
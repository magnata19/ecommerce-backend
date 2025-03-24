import { NextFunction, Request, Response } from "express";
import { CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/exception-root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { RequestCustom } from "../types";

export class CartController {

  static addItemToCart = async (req: RequestCustom, res: Response, next: NextFunction) => {
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product;
    try {
      product = await prismaClient.product.findFirstOrThrow({
        where: { id: +validatedData.productId }
      })
      console.log(req.user)

      const cart = await prismaClient.cartItems.create({
        data: {
          userId: req.user!.id,
          productId: product.id,
          quantity: validatedData.quantity
        }
      })

      res.json(cart)
    } catch (err) {
      next(new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND, err))
    }

  }

  static deleteItemFromCart = async (req: Request, res: Response, next: NextFunction) => {

  }

  static changeQuantity = async (req: Request, res: Response, next: NextFunction) => {

  }

  static getCart = async (req: Request, res: Response, next: NextFunction) => {

  }
}
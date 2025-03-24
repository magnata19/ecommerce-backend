import { NextFunction, Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/exception-root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { RequestCustom } from "../types";
import { BadRequestException } from "../exceptions/bad-request";

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
      // if (cart.productId == validatedData.productId) {
      //   cart.quantity += validatedData.quantity
      // }
      res.json(cart)
    } catch (err) {
      next(new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND, err))
    }

  }

  static deleteItemFromCart = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      const cart = await prismaClient.cartItems.findFirst({
        where: { id: +req.params.id }
      })
      if (cart!.userId != req.user?.id) {
        next(new BadRequestException("You are not allowed to delete this item.", ErrorCode.NOT_ALLOWED, null))
      }
      await prismaClient.cartItems.delete({
        where: { id: +req.params.id }
      })
      res.json({ message: "Cart was successfuly deleted." })
    } catch (err) {
      next(new NotFoundException("Cart item not found!", ErrorCode.PRODUCT_NOT_FOUND, err))
    }
  }

  static changeQuantity = async (req: RequestCustom, res: Response, next: NextFunction) => {
    const validatedData = ChangeQuantitySchema.parse(req.body);
    try {
      const cart = await prismaClient.cartItems.findFirst({
        where: { id: +req.params.id }
      })

      if (cart!.userId != req.user?.id) {
        next(new BadRequestException("You are not allowed to update this item.", ErrorCode.NOT_ALLOWED, null))
      }

      const updatedCart = await prismaClient.cartItems.update({
        where: { id: +req.params.id },
        data: {
          quantity: validatedData.quantity
        }
      })
      res.json(updatedCart)
    } catch (err) {
      next(next(new NotFoundException("Cart item not found!", ErrorCode.PRODUCT_NOT_FOUND, err)))
    }
  }

  static getCart = async (req: RequestCustom, res: Response, next: NextFunction) => {
    const cart = await prismaClient.cartItems.findMany({
      where: { userId: req.user!.id },
      include: {
        product: true
      }
    })
    res.json(cart)
  }
}
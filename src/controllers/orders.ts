import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { RequestCustom } from "../types";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/exception-root";

export class OrdersController {
  static createOrder = async (req: RequestCustom, res: Response, next: NextFunction) => {
    /**
     * 1. to create a transaction
     * 2. to list all the cart items and proceed if cart is not empty
     * 3. calculate the total amount
     * 4. fetch address of user
     * 5. to define a computed field for formatted address on address model
     * 6. we'll create a order and order product 
     * 7. create event
     * 8. make the cart empty
     */
    return await prismaClient.$transaction(async (transaction) => {
      const cartItems = await transaction.cartItems.findMany({
        where: { userId: req.user?.id },
        include: {
          product: true
        }
      })

      if (cartItems.length == 0) {
        return res.json({ message: "Cart is empty." })
      }

      const price = cartItems.reduce((prev, current) => {
        return prev + (current.quantity * Number(current.product?.price))
      }, 0)

      const address = await transaction.address.findFirst({
        where: { id: +req.user?.defaultShippingAddress! }
      })

      const order = await transaction.order.create({
        data: {
          userId: req.user?.id,
          netAmout: price,
          address: address!.formattedAddress,
          products: {
            create: cartItems.map((cart) => {
              return {
                productId: cart.productId,
                quantity: cart.quantity
              }
            })
          }
        }
      })

      const orderEvent = await transaction.orderEvent.create({
        data: {
          orderId: order.id
        }
      })

      await transaction.cartItems.deleteMany({
        where: { userId: req.user?.id }
      })

      res.json(order)
    })
  }

  static listOrders = async (req: RequestCustom, res: Response, next: NextFunction) => {
    const orders = await prismaClient.order.findMany({
      where: { userId: req.user?.id }
    })
    res.json(orders)
  }

  static cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await prismaClient.order.update({
        where: { id: +req.params.id },
        data: {
          status: "CANCELLED"
        }
      })

      await prismaClient.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELLED"
        }
      })

      res.json(order)
    } catch (err) {
      next(new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND, err))
    }
  }

  static getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await prismaClient.order.findFirstOrThrow({
        where: { id: +req.params.id },
        include: {
          products: true,
          OrderEvent: true
        }
      })
      res.json(order)
    } catch (err) {
      next(new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND, err))
    }
  }

  static listAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    let whereClause = {};
    const status = req.query.status
    if (status) {
      whereClause = {
        status
      }
    }
    const order = await prismaClient.order.findMany({
      where: whereClause,
      skip: Number(req.query.skip) || 0,
      take: 5
    })
    // const order = await prismaClient.order.findMany({
    //   skip: Number(req.query.skip) || 0,
    //   take: 5
    // })

    res.json(order)
  }

  static changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await prismaClient.order.update({
        where: {
          id: +req.params.id
        },
        data: {
          status: req.body.status
        }
      })

      await prismaClient.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status
        }
      })

      res.json(order)
    } catch (err) {
      next(new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND, err))
    }
  }

  static listUserOrders = async (req: RequestCustom, res: Response, next: NextFunction) => {
    let whereClause: any = {
      userId: +req.params.id
    }

    const status = req.query.status

    if (status) {
      whereClause = {
        ...whereClause,
        status
      }
    }

    const userOrder = await prismaClient.order.findMany({
      where: whereClause,
      skip: Number(req.params.skip) || 0,
      take: 5
    })

    res.json(userOrder)
  }
}
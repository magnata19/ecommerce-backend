import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/exception-root";
import { BadRequestException } from "../exceptions/bad-request";

export class ProductController {

  static createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await prismaClient.product.create({
        data: {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          tags: Array.isArray(req.body.tags) ? req.body.tags.join(',') : ""  // ['tea', 'coffee'] => 'tea,coffee'
        }
      })
      res.json(product);
    } catch (err: any) {
      next(new BadRequestException("Error creating product", ErrorCode.UNPROCESSABLE_ENTITY, err.message))
    }
  }

  static updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = req.body;
      if (product.tags) {
        product.tags = product.tags.join(',') ?? []
      }
      const updatedProduct = await prismaClient.product.update({
        where: {
          id: +req.params.id, // + converts string to number
        },
        data: product
      })
      return res.json(updatedProduct);
    } catch (err: any) {
      next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND, err))
    }
  }

  static deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prismaClient.product.delete({
        where: { id: +req.params.id }
      })
      res.json({ message: "Product was deleted." })
    } catch (err: any) {
      next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND, err.message))
    }
  }

  static listProduct = async (req: Request, res: Response, next: NextFunction) => {
    const count = await prismaClient.product.count()
    const products = await prismaClient.product.findMany({
      skip: Number(req.query?.skip || 0), // quantity of products to skip
      take: 5 //quantity of products to return
    })
    res.json({
      count, data: products
    })
  }

  static getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await prismaClient.product.findFirstOrThrow({
        where: { id: +req.params.id }
      })
      res.json(product)
    } catch (err: any) {
      next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND, err.message))
    }
  }
}

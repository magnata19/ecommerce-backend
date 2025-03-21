import { Request, Response } from "express";
import { prismaClient } from "..";

export class ProductController {

  static createProduto = async (req: Request, res: Response) => {
    const product = await prismaClient.product.create({
      data: {
        ...req.body,
        tags: req.body.tags.join(',') // ['tea', 'coffee'] => 'tea,coffee'
      }
    })
    res.json(product);
  }
}
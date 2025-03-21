import { Router } from "express";
import { ErrorHandler } from "../error-handler";
import { ProductController } from "../controllers/product-controller";
import { authMiddleware } from "../middlewares/auth";

export const productsRouter: Router = Router();

productsRouter.post('/', [authMiddleware], ErrorHandler(ProductController.createProduto))
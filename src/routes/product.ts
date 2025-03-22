import { Router } from "express";
import { ErrorHandler } from "../error-handler";
import { ProductController } from "../controllers/product-controller";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

export const productsRouter: Router = Router();

productsRouter.post('/', [authMiddleware, adminMiddleware], ErrorHandler(ProductController.createProduct))
productsRouter.put('/:id', [authMiddleware, adminMiddleware], ErrorHandler(ProductController.updateProduct))
productsRouter.delete('/:id', [authMiddleware, adminMiddleware], ErrorHandler(ProductController.deleteProduct))
productsRouter.get('/', [authMiddleware, adminMiddleware], ErrorHandler(ProductController.listProduct))
productsRouter.get('/:id', [authMiddleware, adminMiddleware], ErrorHandler(ProductController.getProductById))									

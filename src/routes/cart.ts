import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ErrorHandler } from "../error-handler";
import { CartController } from "../controllers/cart";

export const cartRouter: Router = Router();

cartRouter.post('/', [authMiddleware], ErrorHandler(CartController.addItemToCart));
cartRouter.get('/', [authMiddleware], ErrorHandler(CartController.getCart));
cartRouter.delete('/:id', [authMiddleware], ErrorHandler(CartController.deleteItemFromCart));
cartRouter.put('/:id', [authMiddleware], ErrorHandler(CartController.changeQuantity));
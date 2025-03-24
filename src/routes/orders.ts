import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { OrdersController } from "../controllers/orders";
import { ErrorHandler } from "../error-handler";

export const orderRouter: Router = Router();

orderRouter.post('/', [authMiddleware], ErrorHandler(OrdersController.createOrder))
orderRouter.get('/', [authMiddleware], ErrorHandler(OrdersController.listOrders))
orderRouter.put('/:id/cancel', [authMiddleware], ErrorHandler(OrdersController.cancelOrder))
orderRouter.get("/:id", [authMiddleware], ErrorHandler(OrdersController.getOrderById))
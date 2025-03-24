import { Router } from "express";
import { authRouter } from "./auth";
import { productsRouter } from "./product";
import { usersRoutes } from "./user";
import { cartRouter } from "./cart";
import { orderRouter } from "./orders";

export const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/product', productsRouter)
rootRouter.use('/user', usersRoutes)
rootRouter.use("/cart", cartRouter)
rootRouter.use('/order', orderRouter)

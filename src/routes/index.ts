import { Router } from "express";
import { authRouter } from "./auth";
import { productsRouter } from "./product";
import { addressRoute } from "./user";

export const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/product', productsRouter)
rootRouter.use('/user', addressRoute)

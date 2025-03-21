import { Router } from "express";
import { authRouter } from "./auth";
import { productsRouter } from "./product";

export const rootRouter: Router = Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/product', productsRouter)

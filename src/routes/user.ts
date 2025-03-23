import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";
import { ErrorHandler } from "../error-handler";
import { UserController } from "../controllers/user-controller";

export const addressRoute: Router = Router();

addressRoute.post('/address', [authMiddleware], ErrorHandler(UserController.addAddress));
addressRoute.delete('/address/:id', [authMiddleware], ErrorHandler(UserController.deleteAddress));
addressRoute.get('/address', [authMiddleware], ErrorHandler(UserController.listAddress));
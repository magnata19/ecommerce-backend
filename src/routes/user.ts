import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ErrorHandler } from "../error-handler";
import { UserController } from "../controllers/user-controller";

export const addressRoute: Router = Router();

addressRoute.post('/address', [authMiddleware], ErrorHandler(UserController.addAddress));
addressRoute.delete('/address/:id', [authMiddleware], ErrorHandler(UserController.deleteAddress));
addressRoute.get('/address', [authMiddleware], ErrorHandler(UserController.listAddress));
addressRoute.put("/update", [authMiddleware], ErrorHandler(UserController.updateUser))
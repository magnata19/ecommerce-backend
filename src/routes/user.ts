import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ErrorHandler } from "../error-handler";
import { UserController } from "../controllers/user-controller";
import { adminMiddleware } from "../middlewares/admin";

export const usersRoutes: Router = Router();

usersRoutes.post('/address', [authMiddleware], ErrorHandler(UserController.addAddress));
usersRoutes.delete('/address/:id', [authMiddleware], ErrorHandler(UserController.deleteAddress));
usersRoutes.get('/address', [authMiddleware], ErrorHandler(UserController.listAddress));
usersRoutes.put("/update", [authMiddleware], ErrorHandler(UserController.updateUser))
usersRoutes.put("/role/:id", [authMiddleware, adminMiddleware], ErrorHandler(UserController.changeUserRole))
usersRoutes.get("/", [authMiddleware, adminMiddleware], ErrorHandler(UserController.listUsers))
usersRoutes.get("/:id", [authMiddleware, adminMiddleware], ErrorHandler(UserController.getUserById))

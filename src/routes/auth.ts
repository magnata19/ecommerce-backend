import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { ErrorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";

export const authRouter: Router = Router();

authRouter.post('/signup', ErrorHandler(AuthController.signUp))
authRouter.post('/login', ErrorHandler(AuthController.login))
authRouter.get('/me', [authMiddleware], ErrorHandler(AuthController.getUserInformation))
import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { ErrorHandler } from "../error-handler";

export const authRouter: Router = Router();

authRouter.post('/signup', ErrorHandler(AuthController.signUp))
authRouter.post('/login', ErrorHandler(AuthController.login))
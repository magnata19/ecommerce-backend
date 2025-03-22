import { Product, User } from "@prisma/client";
import { Request } from "express";

type RequestCustom = Request & { user?: User }
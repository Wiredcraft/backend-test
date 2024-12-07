import { Application } from "express";
import { loginUser } from "../Controllers/AuthController";

export const authRoutes = (app: Application) => {
  app.post("/auth/login", loginUser);
};

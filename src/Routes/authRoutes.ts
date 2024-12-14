import { Application } from "express";
import {
  loginUser,
  createUser,
  logoutUser,
} from "../Controllers/AuthController";
import { checkToken } from "../Services/tokenService";

export const authRoutes = (app: Application) => {
  app.post("/api/auth/register", createUser);
  app.post("/api/auth/login", loginUser);
  app.post("/api/auth/logout", checkToken, logoutUser);
};

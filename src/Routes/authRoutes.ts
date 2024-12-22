import { Application } from "express";
import {
  loginUser,
  createUser,
  logoutUser,
} from "../Controllers/AuthController";
import { checkToken } from "../Services/tokenService";

export const authRoutes = (app: Application) => {
  app.post("/auth/register", createUser);
  app.post("/auth/login", loginUser);
  app.post("/auth/logout", checkToken, logoutUser);
};

import { Application } from "express";
import { getUsers } from "../Controllers/UserController";

export const userRoutes = (app: Application) => {
  app.get("/index", getUsers);
};

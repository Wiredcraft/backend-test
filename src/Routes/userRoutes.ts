import { Application } from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../Controllers/UserController";
import { checkToken } from "../Services/tokenService";

export const userRoutes = (app: Application) => {
  app.get("/index", checkToken, getUsers);
  app.put("/update/:id", checkToken, updateUser);
  app.delete("/delete/:id", checkToken, deleteUser);
};

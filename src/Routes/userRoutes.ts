import { Application } from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  changePass,
} from "../Controllers/UserController";
import { checkToken } from "../Services/tokenService";

export const userRoutes = (app: Application) => {
  app.get("/api/index", checkToken, getUsers);
  app.put("/api/update/:id", checkToken, updateUser);
  app.put("/api/change/pass/:id", checkToken, changePass);
  app.delete("/api/delete/:id", checkToken, deleteUser);
};

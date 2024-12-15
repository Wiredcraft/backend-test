import { Application } from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  changePass,
} from "../Controllers/UserController";
import { checkToken } from "../Services/tokenService";

export const userRoutes = (app: Application) => {
  app.get("/index", checkToken, getUsers);
  app.put("/update/:id", checkToken, updateUser);
  app.put("/change/pass/:id", checkToken, changePass);
  app.delete("/delete/:id", checkToken, deleteUser);
};

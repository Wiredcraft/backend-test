import { Application } from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  changePass,
  addLocation,
} from "../Controllers/UserController";
import { checkToken } from "../Services/tokenService";

export const userRoutes = (app: Application) => {
  app.get("/index", checkToken, getUsers);
  app.put("/update/:id", checkToken, updateUser);
  app.put("/change/pass/:id", checkToken, changePass);
  app.delete("/delete/:id", checkToken, deleteUser);
  app.put("/save-location/:id", checkToken, addLocation);
};

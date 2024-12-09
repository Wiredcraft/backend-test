import { Application } from "express";
import {
  getProfile,
  sendInvite,
  setInvite,
} from "../Controllers/ProfileController";
import { checkToken } from "../Services/tokenService";

export const profileRoutes = (app: Application) => {
  app.get("/profile/:userId", checkToken, getProfile);
  app.post("/profile/:user/:userId", checkToken, sendInvite);
  app.post("/res/:user", checkToken, setInvite);
};

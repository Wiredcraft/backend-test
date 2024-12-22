import { Application } from "express";
import {
  deleteProfile,
  findNearBy,
  getProfile,
  sendInvite,
  setInvite,
} from "../Controllers/ProfileController";
import { checkToken } from "../Services/tokenService";

export const profileRoutes = (app: Application) => {
  // Busca o perfil do usuário
  app.get("/profile/:userId", checkToken, getProfile);
  // Buscar usuários próximos a você
  app.get("/profile/nearby/:userId", checkToken, findNearBy);
  // Envia um convite de amizade para o usuário receiver
  app.post("/profile/:receiverId/:senderId", checkToken, sendInvite);
  // Aceita um convite de amizade
  app.post("/profile/:receiverId", checkToken, setInvite);
  // Deleta um perfil de usuário
  app.delete("/profile/delete/:userId", checkToken, deleteProfile);
};

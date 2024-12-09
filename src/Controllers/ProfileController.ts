import { Request, Response, NextFunction } from "express";
import { invite, showProfile, responseInvite } from "../Models/Profile";
import { CustomError } from "../Class/CustomError";
import { Follow } from "../Class/profile";
import { ObjectId } from "mongodb";

// método para retornar o perfil de um usuário
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const profile = await showProfile(userId);

    res.status(200).json(profile);
  } catch (error: any) {
    return next(error);
  }
};

// método para enviar uma solicitação de amizade para um usuário
export const sendInvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // user = usuário que irá receber o convite
  // userId = usuário que está mandando o convite
  const { user, userId } = req.params;

  if (!user || !userId) {
    throw new CustomError("User and UserID is required", 422);
  }

  try {
    // buscando o perfil do usuário que está enviando o convite
    const profile = await showProfile(userId);
    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    // passando o id do usuário que vai receber o convite, e o perfil de quem enviou o convite
    const inviteSend = await invite(user, profile);
    if (!inviteSend) {
      throw new CustomError("Error to send invite, try again later", 400);
    }

    res.status(200).json({ message: "Invite sended successfully" });
  } catch (error: any) {
    return next(error);
  }
};

// método para responder uma solicitação de amizade
export const setInvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // user = id do usuário que recebeu o convite
  const { user } = req.params;
  // userId = id do usuário que enviou o convite
  const { userId, respost } = req.body;

  if (!user) {
    throw new CustomError("UserId is required", 422);
  }

  try {
    // busco o perfil do usuário dono do perfil
    const receiverProfile = await showProfile(user);
    const senderProfile = await showProfile(userId);
    if (!receiverProfile || !senderProfile) {
      throw new CustomError("Profile not found", 404);
    }

    const userAlready = receiverProfile.followers?.find(
      (follow) => follow.userId == userId
    );

    if (userAlready) {
      throw new CustomError("Users already friend", 400);
    }

    console.log("Convites antes do filtro", receiverProfile);

    if (respost === 1) {
      const newFriend: Follow = {
        userId: new ObjectId(userId),
        followDate: new Date(),
      };

      // atualizando os seguidores do usuário que recebeu o convite
      receiverProfile.followers = [
        ...(receiverProfile.followers || []),
        newFriend,
      ];

      // atualizando os amigos do usuário que enviou o convite
      const receiverFriend: Follow = {
        userId: new ObjectId(user),
        followDate: new Date(),
      };
      senderProfile.followers = [
        ...(senderProfile.followers || []),
        receiverFriend,
      ];

      // removendo o convite da lista
      receiverProfile.invites = receiverProfile.invites?.filter(
        (invite) => invite.userId != userId
      );

      // atualizando perfis no banco de dados
      await responseInvite(user, receiverProfile);
      await responseInvite(userId, senderProfile);
    }

    res.status(200).json({ message: "Friend request successfully accepted" });
  } catch (error: any) {
    return next(error);
  }
};

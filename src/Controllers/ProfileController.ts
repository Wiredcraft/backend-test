import { Request, Response, NextFunction } from "express";
import {
  invite,
  showProfile,
  responseInvite,
  destroyProfile,
  findLocation,
} from "../Models/Profile";
import { CustomError } from "../Class/CustomError";
import { Follow } from "../Class/profile";
import { ObjectId } from "mongodb";
import { findUserById } from "../Models/User";

// método para retornar o perfil de um usuário
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const profile = await showProfile(userId);

    if (profile === null) {
      throw new CustomError("User profile not found", 404);
    }

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
  const { receiverId, senderId } = req.params;

  if (!receiverId || !senderId) {
    throw new CustomError("ReceiverId and SenderID is required", 422);
  }

  try {
    if (receiverId === senderId) {
      throw new CustomError("Can't sent an invitation to yourself", 400);
    }
    // buscando o perfil do usuário que está enviando o convite
    const profile = await showProfile(senderId);
    if (!profile) {
      throw new CustomError("Profile not found", 404);
    }

    // passando o id do usuário que vai receber o convite, e o perfil de quem enviou o convite
    const inviteSend = await invite(receiverId, profile);
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
  // receiverId = id do usuário que recebeu o convite
  const { receiverId } = req.params;
  // userId = id do usuário que enviou o convite
  const { userId, respost } = req.body;

  if (!receiverId) {
    throw new CustomError("ReceiverID is required", 422);
  }

  try {
    // busco o perfil do usuário dono do perfil
    const receiverProfile = await showProfile(receiverId);
    const senderProfile = await showProfile(userId);
    if (!receiverProfile || !senderProfile) {
      throw new CustomError("Profile not found", 404);
    }

    const userAlready = receiverProfile.followers?.find(
      (follow) => follow.userId == userId
    );

    if (userAlready) {
      throw new CustomError("Users already friends", 400);
    }

    //console.log("Convites antes do filtro", receiverProfile);

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
        userId: new ObjectId(receiverId),
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
      await responseInvite(receiverId, receiverProfile);
      await responseInvite(userId, senderProfile);
    }

    res.status(200).json({ message: "Friend request successfully accepted" });
  } catch (error: any) {
    return next(error);
  }
};

// método para excluir um perfil de usuário
export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  if (!userId) {
    throw new CustomError("UserId is required", 422);
  }

  try {
    const response = await destroyProfile(userId);

    if (!response) {
      throw new CustomError("Failed to delete user", 400);
    }

    res
      .status(200)
      .json({ message: "User Profile deleted successfully", response });
  } catch (error: any) {
    return next(error);
  }
};

// método para buscar amigos próximos ao usuário
export const findNearBy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // userId do usuário que iniciou a busca
  const { userId } = req.params;

  try {
    // buscando os dados do usuário para obter sua localização
    const user = await findUserById(userId);
    if (!user || !user.location) {
      throw new CustomError("User or address not found", 404);
    }

    console.log(user);

    // buscando o perfil do usuários para obter seus seguidores
    const profile = await showProfile(userId);
    console.log(profile);
    if (!profile || !profile.followers || profile.followers.length === 0) {
      throw new CustomError("No followers found", 400);
    }

    // extraindo o id dos seus seguidores
    const followersId = profile.followers.map(
      (follower: any) => follower.userId
    );

    console.log(followersId);

    // passando usuário e os ids dos seguidores para função calcular a distância
    const friendsNeayBy = await findLocation(user, followersId);

    // retornando o resultado
    res.status(200).json(friendsNeayBy);
  } catch (error: any) {
    return next(error);
  }
};

import { Request, Response, NextFunction } from "express";
import { show } from "../Models/User";
import { CustomError } from "../Class/CustomError";

// método para buscar todos os usuários
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await show();
    if (!users) {
      const error = new Error("Users not found") as CustomError;
      error.statusCode = 400;
      return next(error);
    }

    res.status(200).json(users);
  } catch (error: any) {
    next(error); // encaminha para o middleware de erros
  }
};

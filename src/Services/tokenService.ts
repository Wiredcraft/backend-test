import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../Class/CustomError";

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // instanciando o middleware de errors
  const error = new Error("Error from Service Token") as CustomError;

  // pegando o header authorization da requisição
  const authHeader = req.headers.authorization;

  // pega o token do header, faz um split para remover o espaço e pega o token no array resultante
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    error.statusCode = 401;
    error.message = "Access denied, unauthorized";
    next(error);
  }

  try {
    const secret = process.env.SECRET;

    if (!secret) {
      error.statusCode = 500;
      next(error);
    }

    // verificando se token e o secret são strings antes de aplicar o cast
    if (typeof token !== "string" || typeof secret !== "string") {
      error.statusCode = 500;
      next(error);
    }

    // verificando se o token é válido, se for prossegue a requisição feita
    jwt.verify(token as string, secret as string);
    next();
  } catch (error: any) {
    next(error);
  }
};

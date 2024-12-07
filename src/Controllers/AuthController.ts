import { Request, Response, NextFunction } from "express";
import { findUserByEmail } from "../Models/User";
import { schemaLogin } from "../Services/schemasService";
import bcrypt from "bcryptjs";
import { CustomError } from "../Class/CustomError";
import jwt from "jsonwebtoken";

// método que faz o login do usuário
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  // validando o formato do email e da senha antes de praticar qualquer consulta no banco
  const validate = schemaLogin.safeParse(req.body);

  if (!validate.success) {
    res.status(422).json({ error: validate.error.errors });
    return;
  }

  try {
    const user = await findUserByEmail(email);

    // verificando se o usuário foi encontraod
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // verificando se a senha passada confere com a senha grava no banco
    if (!bcrypt.compareSync(password, user.password)) {
      const error = new Error("Credentials invalid") as CustomError;
      error.statusCode = 422;
      error.message = "Email or password incorrects!";
      next(error);
    }

    const secret: string | undefined = process.env.SECRET;

    // verificando se o SECRET está presente antes de prosseguir
    if (!secret) {
      const error = new Error("Internal Server Error") as CustomError;
      error.statusCode = 500;
      next(error);
    }

    // gerando o token
    const token: string = jwt.sign({ id: user._id }, secret as string, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "User authenticated successfully", token });
  } catch (error: any) {
    next(error);
  }
};

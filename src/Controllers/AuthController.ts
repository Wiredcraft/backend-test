import { Request, Response, NextFunction } from "express";
import { findUserByEmail } from "../Models/User";
import { schemaLogin } from "../Services/schemasService";
import { store } from "../Models/User";
import { schemaUser } from "../Services/schemasService";
import bcrypt from "bcryptjs";
import { CustomError } from "../Class/CustomError";
import jwt from "jsonwebtoken";
import { blacklistToken } from "../Services/tokenService";
import { Token } from "../Class/token";
import { Profile } from "../Class/profile";
import { createProfile } from "../Models/Profile";

// método para criar um novo usuário
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, dateBirth, address, location, description } =
    req.body;

  // convertendo a string recebida para data antes de passar pela validação
  const dob = new Date(dateBirth);

  // validando a entrada de dados
  const validate = schemaUser.safeParse({
    name,
    email,
    password,
    dob,
    address,
    location,
    description,
  });

  if (!validate.success) {
    res.status(422).json({ error: validate.error.errors });
    return;
  }

  // aplicando um hashing a senha antes de salva-lá no banco de dados
  const passwordHashing = bcrypt.hashSync(password, 10);

  try {
    // verificando se o usuário existe antes de cria-lo
    const user = await findUserByEmail(email);
    if (user) {
      res.status(400).json({ error: "Email is not available" });
      return;
    }

    // construindo o modelo de usuário
    const newUser = {
      name,
      email,
      password: passwordHashing,
      dob,
      address,
      location,
      description,
      createdAt: new Date(),
    };

    // chamando a função store do Model e registrando o usuário
    const userCreated = await store(newUser);

    // criando o perfil do usuário passando o id dele e iniciando seguidores e seguindo com um array vazio
    const profile: Profile = {
      userId: userCreated.insertedId,
      followers: [],
      following: [],
    };
    await createProfile(profile);

    res.status(201).json({ message: "User created successfully", userCreated });
  } catch (error: any) {
    return next(error);
  }
};

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
    if (!bcrypt.compareSync(password, user.password as string)) {
      throw new CustomError("Email or Password invalid", 422);
    }

    const secret: string | undefined = process.env.SECRET;

    // verificando se o SECRET está presente antes de prosseguir
    if (!secret) {
      throw new CustomError("Internal Server Error", 500);
    }

    // gerando o token
    const token: string = jwt.sign({ id: user._id }, secret as string, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "User authenticated successfully", token });
  } catch (error: any) {
    return next(error);
  }
};

// método para efetuar o logout do usuário
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // pega o token da requisição
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new CustomError("Access denied, unauthorize", 401);
    }

    const newToken: Token = new Token(token, new Date());
    // adiciona o token a blacklist o invalidando
    await blacklistToken(newToken);

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error: any) {
    return next(error);
  }
};

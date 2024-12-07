import { Request, Response, NextFunction } from "express";
import { show, store, findUserByEmail, update, destroy } from "../Models/User";
import { CustomError } from "../Class/CustomError";
import { schemaUser, schemaUserUpdate } from "../Services/schemasService";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import User from "../Class/user";

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

// método para criar um novo usuário
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, dateBirth, address, description } = req.body;

  // convertendo a string recebida para data antes de passar pela validação
  const dob = new Date(dateBirth);

  // validando a entrada de dados
  const validate = schemaUser.safeParse({
    name,
    email,
    password,
    dob,
    address,
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
      description,
      createdAt: new Date(),
    };

    // chamando a função store do Model e registrando o usuário
    const userCreated = await store(newUser);
    res.status(201).json({ message: "User created successfully", userCreated });
    return;
  } catch (error: any) {
    next(error);
  }
};

// método para atualizar informações comuns do usuário
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, dateBirth, address, description } = req.body;

  // convertendo a string de data recebida em uma data padrão
  const dob = new Date(dateBirth);

  // validando os dados de entrada
  const validate = schemaUserUpdate.safeParse({
    id,
    name,
    dob,
    address,
    description,
  });

  if (!validate.success) {
    res.status(422).json({ error: validate.error.errors });
    return;
  }

  try {
    const objectId = new ObjectId(id);
    // atualizando os dados do usuário
    const userUpdate = {
      _id: objectId,
      name: name,
      dob: dob,
      address: address,
      description: description,
      updatedAt: new Date(),
    };

    // a função update busca e atualiza respectivamente o usuário
    const userUpdated = await update(id, userUpdate);

    res.status(200).json({ message: "User updated successfully", userUpdated });
    return;
  } catch (error: any) {
    next(error);
  }
};

// método para deletar um usuário
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    // a função destroy busca e deleta o usuário
    const userCreated = await destroy(id);
    // se o retorno for null, quer dizer que o usuário não existia
    if (userCreated === null) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      error.message = "User not found";
      return next(error);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    next(error);
  }
};

import { connectMongo } from "../dbconfig/dbconfig";
import { ObjectId } from "mongodb";
import User, { Location } from "../Class/user";

// função para buscar todos os usuário no database
export const show = async () => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const result = await collection.find().toArray();
  return result;
};

// função para buscar usuário pelo id
export const findUserById = async (userId: string) => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const objectId = new ObjectId(userId);
  const result = await collection.findOne({ _id: objectId });
  return result;
};

// função para buscar um usuário pelo email(para validações)
export const findUserByEmail = async (email: string) => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const result = await collection.findOne({ email: email });
  return result;
};

// função para criar um novo usuário
export const store = async (user: User) => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const result = await collection.insertOne(user);
  return result;
};

// função para atualizar um usuário
export const update = async (id: string, user: User) => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const objectId = new ObjectId(id);
  const projection = { password: 0 };
  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: user },
    { returnDocument: "after", projection: projection }
  );
  return result;
};

// função para salvar a localização de um usuário
export const saveLocation = async (id: string, location: Location) => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const objectId = new ObjectId(id);
  //const projection = { password: 0 };
  const result = await collection.updateOne(
    { _id: objectId },
    { $set: { location: location } }
  );
  return result;
};

// função para deletar um usuário
export const destroy = async (id: string) => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const objectId = new ObjectId(id);
  const result = await collection.findOneAndDelete({ _id: objectId });
  return result;
};

import { connectMongo } from "../dbconfig/dbconfig";
import { Token } from "../Class/token";

// função para salver o token na blacklist
export const insertToken = async (token: Token) => {
  const db = await connectMongo();
  const collection = db.collection<Token>("blacklist");
  const result = await collection.insertOne(token);
  return result;
};

// função para buscar um token na blacklist
export const findToken = async (token: string) => {
  const db = await connectMongo();
  const collection = db.collection<Token>("blacklist");
  const result = await collection.findOne({ token: token });
  return result;
};

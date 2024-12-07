import { connectMongo } from "../dbconfig/dbconfig";
import User from "../Class/user";

export const show = async () => {
  const db = await connectMongo();
  const collection = db.collection<User>("users");
  const result = collection.find().toArray();
  return result;
};

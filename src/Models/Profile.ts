import { connectMongo } from "../dbconfig/dbconfig";
import { Profile, Follow } from "../Class/profile";
import { ObjectId } from "mongodb";

// função para criar um perfil para o usuário
export const createProfile = async (profile: Profile) => {
  const db = await connectMongo();
  const collection = db.collection<Profile>("profiles");
  const result = await collection.insertOne(profile);
  return result;
};

// função para retornar o perfil de um usuário
export const showProfile = async (userId: string) => {
  const db = await connectMongo();
  const collection = db.collection<Profile>("profiles");
  const objectId = new ObjectId(userId);
  const result = await collection.findOne({ userId: objectId });
  return result;
};

// função para enviar um convite de amizade para um usuário
export const invite = async (userId: string, profile: Profile) => {
  const db = await connectMongo();
  const collection = db.collection<Profile>("profiles");
  const objectId = new ObjectId(userId);

  const result = await collection.findOneAndUpdate(
    { userId: objectId },
    { $push: { invites: profile } },
    { returnDocument: "after" }
  );
  return result;
};

// função para aceitar um convite de amizade
export const responseInvite = async (userId: string, profile: Profile) => {
  const db = await connectMongo();
  const collection = db.collection<Profile>("profiles");
  const objectId = new ObjectId(userId);
  const result = await collection.findOneAndUpdate(
    { userId: objectId },
    { $set: profile },
    { returnDocument: "after" }
  );
  return result;
};

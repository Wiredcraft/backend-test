import { connectMongo } from "../dbconfig/dbconfig";
import { Profile, Follow } from "../Class/profile";
import { ObjectId } from "mongodb";
import User from "../Class/user";

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

// função para deletar um perfil
export const destroyProfile = async (userId: string) => {
  const db = await connectMongo();
  const collection = db.collection<Profile>("profiles");
  const objectId = new ObjectId(userId);
  const result = await collection.findOneAndDelete({ userId: objectId });
  return result;
};

// função para verificar usuários próximos pela geolocalização
export const findLocation = async (user: User, followersIds: any[]) => {
  const db = await connectMongo();
  const usersCollection = db.collection<User>("users");
  const R = 6371; // Raio da Terra
  const MAX_DISTANCE_KM = 10; // distância máxima em KM
  const nearByFollowers = await usersCollection
    .aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: user.location?.coordinates, // latitude e longitude
          },
          distanceField: "distance",
          maxDistance: MAX_DISTANCE_KM * 1000, // converte para metros
          spherical: true,
          query: { _id: { $in: followersIds } }, // limita aos seguidores
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          address: 1,
          distance: { $round: ["$distance", 2] }, // distância em km arrendondada
        },
      },
      { $sort: { distance: 1 } },
    ])
    .toArray();
  return nearByFollowers;
};

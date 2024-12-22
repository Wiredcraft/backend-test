import { MongoClient, Db } from "mongodb";
import "dotenv/config";

let db: Db | null = null;
let client: MongoClient | null = null;

export async function connectMongo(): Promise<Db> {
  // se a conexão já existe retorna ela
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(process.env.DB_STRING || "");

    await client.connect();

    console.log("Connected with success.");

    db = client.db("wiredcraft");
    return db;
  } catch (error: unknown) {
    console.log(`Error connecting database ${error}`);
    throw new Error("Failed connect to database");
  }
}

export async function disconnectMongo(): Promise<void> {
  if (client) {
    await client.close();
    console.log("connection closed");
    db = null;
    client = null;
  }
}

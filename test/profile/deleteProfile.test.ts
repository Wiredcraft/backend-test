import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { connectMongo, disconnectMongo } from "../../src/dbconfig/dbconfig";
import { userData } from "../mocks/user";

describe("Endpoin DELETE Profile", () => {
  it("Must delete an user successfully", async () => {
    const profile = await request(app).post("/auth/register").send(userData);

    const userId = profile.body.userCreated.insertedId;

    const response = await request(app).delete(`/profile/delete/${userId}`);

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  it("Must return an error, user not found", async () => {
    const userId = "67571a30f222aa1a0c4accdf"; // id invalid

    const response = await request(app).delete(`/profile/delete/${userId}`);

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("Failed to delete user");
  });
});

afterAll(async () => {
  const db = await connectMongo();
  await db.collection("users").deleteMany({});
  await db.collection("profiles").deleteMany({});
  await disconnectMongo();
});

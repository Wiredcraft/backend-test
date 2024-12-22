import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { disconnectMongo, connectMongo } from "../../src/dbconfig/dbconfig";
import { userData } from "../mocks/user";

describe("GET Profile - /profiler/userId", () => {
  it("should return the user profile", async () => {
    const newUser = await request(app).post("/auth/register").send(userData);

    const userId = newUser.body.userCreated.insertedId;

    const response = await request(app).get(`/profile/${userId}`);

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(200);
  });

  it("shouldn't return the user profile", async () => {
    const fakeId = "675c41c60e584f0dbf79a679"; // id not exist in database

    const response = await request(app).get(`/profile/${fakeId}`);

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("User profile not found");
  });
});

afterAll(async () => {
  const db = await connectMongo();
  await db.collection("users").deleteMany({});
  await db.collection("profiles").deleteMany({});
  await disconnectMongo();
});

import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { disconnectMongo, connectMongo } from "../../src/dbconfig/dbconfig";
import { userData, userData2, userData3, userData4 } from "../mocks/user";

describe("Endpoint Profile to send request friendship", () => {
  it("should sends an invite with success", async () => {
    const receiverInvite = await request(app)
      .post("/auth/register")
      .send(userData);
    const senderInvite = await request(app)
      .post("/auth/register")
      .send(userData2);

    const receiverId = receiverInvite.body.userCreated.insertedId;
    const senderId = senderInvite.body.userCreated.insertedId;

    const response = await request(app).post(
      `/profile/${receiverId}/${senderId}`
    );

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Invite sended successfully");
  });

  it("should return an error 400, failed to send invite", async () => {
    const senderInvite = await request(app)
      .post("/auth/register")
      .send(userData3);
    const fakeReceiverId = "675c46219cd8185945857d0d"; // user not exist

    const senderId = senderInvite.body.userCreated.insertedId;

    const response = await request(app).post(
      `/profile/${fakeReceiverId}/${senderId}`
    );

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("Error to send invite, try again later");
  });

  it("should return an error 404, profile not found", async () => {
    const receiverInvite = await request(app)
      .post("/auth/register")
      .send(userData4);
    const fakeSenderId = "675c46219cd8185945857d0d"; // user not exist

    const receiverId = receiverInvite.body.userCreated.insertedId;

    const response = await request(app).post(
      `/profile/${receiverId}/${fakeSenderId}`
    );

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("Profile not found");
  });
});

afterAll(async () => {
  const db = await connectMongo();
  await db.collection("users").deleteMany({});
  await db.collection("profiles").deleteMany({});
  await disconnectMongo();
});

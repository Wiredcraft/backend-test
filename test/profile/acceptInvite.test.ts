import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { connectMongo, disconnectMongo } from "../../src/dbconfig/dbconfig";
import { userData, userData2, userData3, userData4 } from "../mocks/user";

describe("Endpoint to Accept invite", () => {
  it("Must return invitation sent successfully", async () => {
    const profile1 = await request(app).post("/auth/register").send(userData);
    const profile2 = await request(app).post("/auth/register").send(userData2);

    const receiverId = profile1.body.userCreated.insertedId;
    const senderId = profile2.body.userCreated.insertedId;

    const sendInvite = await request(app).post(
      `/profile/${receiverId}/${senderId}`
    );

    console.log("Send invite:", sendInvite.body);

    const response = await request(app).post(`/profile/${receiverId}`).send({
      userId: senderId,
      respost: 1, // 1 to accept
    });

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Friend request successfully accepted");
  });

  it("Must return an error 400", async () => {
    const profile1 = await request(app).post("/auth/register").send(userData3);

    const receiverId = profile1.body.userCreated.insertedId;
    const senderId = profile1.body.userCreated.insertedId;

    console.log("Receiver:", receiverId);
    console.log("Sender:", senderId);

    // receiver and sender same id
    const response = await request(app).post(
      `/profile/${receiverId}/${senderId}`
    );

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("Can't sent an invitation to yourself");
  });
});

afterAll(async () => {
  const db = await connectMongo();
  await db.collection("users").deleteMany({});
  await db.collection("profiles").deleteMany({});
  await disconnectMongo();
});

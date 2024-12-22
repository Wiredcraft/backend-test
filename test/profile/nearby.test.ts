import request from "supertest";
import { app } from "../../src/server";
import { afterAll, expect } from "@jest/globals";
import { connectMongo, disconnectMongo } from "../../src/dbconfig/dbconfig";
import { userData, userData2, userData3 } from "../mocks/user";

describe("Endpoint /profile/nearby/userId", () => {
  it("Should return the friends nearby", async () => {
    // creating profiles
    const profile = await request(app).post("/auth/register").send(userData);
    const profile2 = await request(app).post("/auth/register").send(userData2);
    const profile3 = await request(app).post("/auth/register").send(userData3);

    // get ids
    const receiverId = profile.body.userCreated.insertedId;
    const senderId = profile2.body.userCreated.insertedId;
    const senderId2 = profile3.body.userCreated.insertedId;

    console.log(receiverId, senderId, senderId2);

    // sending invites
    const sendInvite1 = await request(app).post(
      `/profile/${receiverId}/${senderId}`
    );
    const sendInvite2 = await request(app).post(
      `/profile/${receiverId}/${senderId2}`
    );

    console.log(sendInvite1.body, sendInvite2.body);

    // accepting invites
    const accepting1 = await request(app).post(`/profile/${receiverId}`).send({
      userId: senderId,
      respost: 1,
    });
    const accepting2 = await request(app).post(`/profile/${receiverId}`).send({
      userId: senderId2,
      respost: 1,
    });

    console.log(accepting1.body, accepting2.body);

    // testing friends nearby
    const response = await request(app).get(`/profile/nearby/${receiverId}`);

    console.log("Status:", response.status, "\n", response.body);
  });
  afterAll(async () => {
    const db = await connectMongo();
    await db.collection("users").deleteMany({});
    await db.collection("profiles").deleteMany({});
    await disconnectMongo();
  });
});

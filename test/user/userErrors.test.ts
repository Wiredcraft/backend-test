import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { disconnectMongo, connectMongo } from "../../src/dbconfig/dbconfig";
import { userData, userData2, userData3 } from "../mocks/user";

describe("Errors Endpoint Users", () => {
  it("should return 422, data invalids", async () => {
    const newUser = await request(app).post("/auth/register").send(userData);

    const userId = newUser.body.userCreated.insertedId;

    const response = await request(app).put(`/update/${userId}`).send({
      name: "    ", // input name format invalid
      dateBirth: "1999/01/02",
      address: "Avenida Brasil 77",
      description: "Usuário atualizado",
    });

    console.log("Status: ", response.status, "\n", response.body);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 422, data invalids", async () => {
    const newUser = await request(app).post("/auth/register").send(userData2);

    const userId = newUser.body.userCreated.insertedId;

    const response = await request(app).put(`/update/${userId}`).send({
      name: "Heryson Belkior",
      dateBirth: "14/09/1999", // input invalid, correct => 1999/09/14
      address: "Avenida Brasil 77",
      description: "Usuário atualizado",
    });

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 422, format invalid", async () => {
    const newUser = await request(app).post("/auth/register").send(userData3);

    const userId = newUser.body.userCreated.insertedId;

    const response = await request(app).put(`/update/${userId}`).send({
      name: 12311341, // format invalid
      dateBirth: "1999/09/14",
      address: 231312, // format invalid
      description: 231321314, // format invalid
    });

    console.log("Status:", response.status, "\n", response.body);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  const db = await connectMongo();
  await db.collection("users").deleteMany({});
  await db.collection("profiles").deleteMany({});
  await disconnectMongo();
  await disconnectMongo();
});

import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { disconnectMongo, connectMongo } from "../../src/dbconfig/dbconfig";
import { userData, userData2, userData3, userData4 } from "../mocks/user";

describe("Endpoints Users", () => {
  it("should return all of users", async () => {
    const response = await request(app).get("/index");

    // If not exist users, return an empty array
    console.log("All users from database", response.body);

    expect(response.status).toBe(200);
  });

  it("should to update an user successfully", async () => {
    const newUser = await request(app).post("/auth/register").send(userData);

    // capturando o id do user criado
    const userId = newUser.body.userCreated.insertedId;

    console.log(userId);

    const response = await request(app)
      .put(`/update/${userId}`)
      .send({
        name: "Heryson Belkior",
        dateBirth: "1999/01/02",
        address: {
          street: "Avenida Brasil",
          number: 77,
          city: "São Paulo",
        },
        description: "Usuário atualizado",
      });

    console.log("Update user: ", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
  });

  it("should to delete an user successfully", async () => {
    const newUser = await request(app).post("/auth/register").send(userData2);

    console.log("User created: ", newUser.body);

    // capturando id do user criado
    const userId = await newUser.body.userCreated.insertedId;

    const response = await request(app).delete(`/delete/${userId}`);

    console.log("User deleted", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  it("should return status 422 invalid data", async () => {
    const newUser = await request(app).post("/auth/register").send(userData3);

    const userId = newUser.body.userCreated.insertedId;

    const response = await request(app).put(`/update/${userId}`).send({
      name: "Heryson Belkior",
      dateBirth: "1999/01/02",
      address: "Avenida Brasil 77",
      description: 44, // format invalid,
    });

    console.log(response.body);

    expect(response.status).toBe(422);
    expect(response.body.error);
  });

  it("should to change the user password", async () => {
    const newUser = await request(app).post("/auth/register").send(userData4); // pass !Test12345

    const userId = newUser.body.userCreated.insertedId;

    const response = await request(app).put(`/change/pass/${userId}`).send({
      email: userData4.email,
      newPass: "!Newpassword1223",
    });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password changed successfully");
  });
});

afterAll(async () => {
  const db = await connectMongo();
  await db.collection("users").deleteMany({});
  await db.collection("profiles").deleteMany({});
  await disconnectMongo();
  await disconnectMongo();
});

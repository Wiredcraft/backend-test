import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { disconnectMongo, connectMongo } from "../../src/dbconfig/dbconfig";

const user = {
  name: "Test jest",
  email: `test${Date.now()}@gmail.com`,
  password: "!Test12345",
  dob: "1999/09/14",
  address: {
    street: "Avenida teste",
    number: 24,
    city: "Teste town",
  },
  location: {
    type: "Point",
    coordinates: [-46.625454, -23.533394],
  },
  description: "Test description",
};

describe("POST /auth/register", () => {
  // simulando um registro com sucesso!
  it("should simulate a register sucessfully", async () => {
    const response = await request(app).post("/auth/register").send({
      name: user.name,
      email: user.email,
      password: user.password,
      dateBirth: user.dob,
      address: user.address,
      location: user.location,
      description: user.description,
    });

    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
  });

  // simulando uma entrada vazia "" para name
  it("should simulate input invalid to name", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "   ", // empty input
      email: user.email,
      password: user.password,
      dateBirth: user.dob,
      adresss: user.address,
      location: user.location,
      description: user.description,
    });

    console.log("linha 54", response.body);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("error");
  });

  // simulando a entrada de um email já existente na base de dados
  it("should simulate input invalid to email", async () => {
    // crio um usuário
    const response = await request(app).post("/auth/register").send({
      name: user.name,
      email: user.email,
      password: user.password,
      dateBirth: user.dob,
      address: user.address,
      location: user.location,
      description: user.description,
    });

    // em seguida tento criar um outro usuário com mesmo email
    const responseError = await request(app).post("/auth/register").send({
      name: user.name,
      email: user.email, // same email
      password: user.password,
      dateBirth: user.dob,
      address: user.address,
      location: user.location,
      description: user.description,
    });

    console.log(" Linha 67", responseError.body);

    expect(responseError.status).toBe(400);
    expect(responseError.body).toHaveProperty("error");
  });

  // simulando a entrada de uma senha fraca
  it("should simulate input a weak password", async () => {
    const response = await request(app).post("/auth/register").send({
      name: user.name,
      email: user.email,
      password: "teste12345", // password weak
      dob: user.dob,
      adresss: user.address,
      location: user.location,
      description: user.description,
    });

    console.log(response.body);

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

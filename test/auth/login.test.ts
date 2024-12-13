import request from "supertest";
import { app } from "../../src/server";
import { expect } from "@jest/globals";
import { disconnectMongo } from "../../src/dbconfig/dbconfig";

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

describe("POST /auth/login", () => {
  it("should return 200 and a token for valid credentials", async () => {
    const register = await request(app).post("/auth/register").send({
      name: user.name,
      email: user.email,
      password: user.password,
      dateBirth: user.dob,
      address: user.address,
      location: user.location,
      description: user.description,
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    console.log("Login success:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User authenticated successfully");
    expect(response.body).toHaveProperty("token");
  });

  it("should return 422 for invalid credentials", async () => {
    const register = await request(app).post("/auth/register").send({
      name: user.name,
      email: user.email,
      password: user.password,
      dateBirth: user.dob,
      address: user.address,
      location: user.location,
      description: user.description,
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "invalidPass" });

    console.log("Password invalid", response.body);
    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 422 for missing email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: "passwordWithoutEmail" });

    console.log("Missing email:", response.body);
    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 422 for missing password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email });

    console.log("Missing password:", response.body);
    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  await disconnectMongo();
});

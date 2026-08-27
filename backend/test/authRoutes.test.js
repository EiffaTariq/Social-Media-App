import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("POST /api/auth/register", () => {
  it("registers a new user with valid data (happy path)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Eiffa Tariq",
      username: "eiffa_t",
      email: "eiffa@test.com",
      password: "password123",
      gender: "female",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("eiffa@test.com");
    expect(res.body.user.password).toBeUndefined(); // password must never leak
  });

  it("rejects registration when required fields are missing (failure case)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "eiffa@test.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("rejects a duplicate email (failure case)", async () => {
    const payload = {
      name: "Eiffa Tariq",
      username: "eiffa1",
      email: "dup@test.com",
      password: "password123",
      gender: "female",
    };
    await request(app).post("/api/auth/register").send(payload);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...payload, username: "eiffa2" }); // different username, same email

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});

describe("POST /api/auth/login", () => {
  const credentials = {
    name: "Login Test",
    username: "logintest",
    email: "login@test.com",
    password: "correctpass",
    gender: "female",
  };

  it("logs in successfully with correct credentials (happy path)", async () => {
    await request(app).post("/api/auth/register").send(credentials);

    const res = await request(app).post("/api/auth/login").send({
      email: credentials.email,
      password: credentials.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.headers["set-cookie"]).toBeDefined(); // JWT cookie must be set
  });

  it("rejects login with an incorrect password (failure case)", async () => {
    await request(app).post("/api/auth/register").send(credentials);

    const res = await request(app).post("/api/auth/login").send({
      email: credentials.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
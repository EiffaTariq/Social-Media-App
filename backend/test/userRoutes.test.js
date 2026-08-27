import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

async function registerAndLogin(username, email) {
  const agent = request.agent(app);
  const payload = {
    name: username,
    username,
    email,
    password: "password123",
    gender: "female",
  };
  const res = await agent.post("/api/auth/register").send(payload);
  await agent.post("/api/auth/login").send({ email, password: "password123" });
  return { agent, userId: res.body.user._id };
}

describe("User routes", () => {
  it("finds users matching a search query (happy path)", async () => {
    await registerAndLogin("alikhan", "ali@test.com");

    const res = await request(app).get("/api/user/search").query({ q: "ali" });

    expect(res.status).toBe(200);
    expect(res.body.users.some((u) => u.username === "alikhan")).toBe(true);
  });

  it("returns an empty array for a search with no matches (failure/edge case)", async () => {
    const res = await request(app).get("/api/user/search").query({ q: "nonexistentxyz" });

    expect(res.status).toBe(200);
    expect(res.body.users).toEqual([]);
  });

  it("follows another user when authenticated (happy path)", async () => {
    const { agent } = await registerAndLogin("follower1", "follower1@test.com");
    const { userId: targetId } = await registerAndLogin("target1", "target1@test.com");

    const res = await agent.post(`/api/user/${targetId}/follow`);

    expect(res.status).toBe(200);
  });

  it("rejects following yourself (failure case)", async () => {
    const { agent, userId } = await registerAndLogin("selffollow", "self@test.com");

    const res = await agent.post(`/api/user/${userId}/follow`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("You can't follow yourself");
  });

  it("rejects following without authentication (failure case)", async () => {
    const { userId: targetId } = await registerAndLogin("target2", "target2@test.com");

    const res = await request(app).post(`/api/user/${targetId}/follow`);

    expect(res.status).toBe(401);
  });
});
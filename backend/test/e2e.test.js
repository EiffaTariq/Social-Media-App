import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("E2E: register -> login -> create post -> see it in feed", () => {
  it("simulates a full new-user flow end to end", async () => {
    const agent = request.agent(app);

    // Step 1: user registers
    const registerRes = await agent.post("/api/auth/register").send({
      name: "Eiffa Tariq",
      username: "eiffa_e2e",
      email: "eiffa_e2e@test.com",
      password: "password123",
      gender: "female",
    });
    expect(registerRes.status).toBe(201);
    const userId = registerRes.body.user._id;

    // Step 2: user logs in (agent now carries the session cookie for all future calls)
    const loginRes = await agent.post("/api/auth/login").send({
      email: "eiffa_e2e@test.com",
      password: "password123",
    });
    expect(loginRes.status).toBe(200);

    // Step 3: logged-in user creates a post
    const createRes = await agent.post("/api/post/new").send({
      caption: "Hello from my first post!",
      ownerId: userId,
    });
    expect(createRes.status).toBe(201);
    const postId = createRes.body.post._id;

    // Step 4: the new post appears in the public feed
    const feedRes = await request(app).get("/api/post/all");
    expect(feedRes.status).toBe(200);
    const createdPost = feedRes.body.posts.find((p) => p._id === postId);
    expect(createdPost).toBeDefined();
    expect(createdPost.caption).toBe("Hello from my first post!");
  });
});
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

// Helper: registers + logs in a user, returns { agent, userId }
// The agent persists cookies across requests, simulating a logged-in browser session.
async function createLoggedInUser(overrides = {}) {
  const agent = request.agent(app);
  const payload = {
    name: "Post Tester",
    username: "posttester",
    email: "posttester@test.com",
    password: "password123",
    gender: "female",
    ...overrides,
  };
  const registerRes = await agent.post("/api/auth/register").send(payload);
  await agent.post("/api/auth/login").send({ email: payload.email, password: payload.password });
  return { agent, userId: registerRes.body.user._id };
}

describe("Post routes", () => {
  it("creates a new post when authenticated (happy path)", async () => {
    const { agent, userId } = await createLoggedInUser();

    const res = await agent
      .post("/api/post/new")
      .send({ caption: "My first post", ownerId: userId });

    expect(res.status).toBe(201);
    expect(res.body.post.caption).toBe("My first post");
  });

  it("rejects creating a post without a caption (failure case)", async () => {
    const { agent, userId } = await createLoggedInUser();

    const res = await agent.post("/api/post/new").send({ ownerId: userId });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Caption and ownerId are required");
  });

  it("rejects creating a post without authentication (failure case)", async () => {
    const res = await request(app)
      .post("/api/post/new")
      .send({ caption: "Should fail", ownerId: "507f1f77bcf86cd799439011" });

    expect(res.status).toBe(401);
  });

  it("likes a post and reflects it in the response (happy path)", async () => {
    const { agent, userId } = await createLoggedInUser();
    const createRes = await agent.post("/api/post/new").send({ caption: "Likeable", ownerId: userId });
    const postId = createRes.body.post._id;

    const res = await agent.post(`/api/post/${postId}/like`).send({ userId });

    expect(res.status).toBe(200);
    expect(res.body.post.likes).toContain(userId);
  });

  it("returns 404 when liking a post that doesn't exist (failure case)", async () => {
    const { agent, userId } = await createLoggedInUser();
    const fakeId = "507f1f77bcf86cd799439011"; // valid ObjectId format, doesn't exist

    const res = await agent.post(`/api/post/${fakeId}/like`).send({ userId });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No post with this id");
  });
});
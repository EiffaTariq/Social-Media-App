import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

async function registerAndLogin(username, email) {
  const agent = request.agent(app);
  const payload = { name: username, username, email, password: "password123", gender: "female" };
  const res = await agent.post("/api/auth/register").send(payload);
  await agent.post("/api/auth/login").send({ email, password: "password123" });
  return { agent, userId: res.body.user._id };
}

describe("Status routes", () => {
  it("creates a new status when authenticated (happy path)", async () => {
    const { agent, userId } = await registerAndLogin("statususer", "status@test.com");

    const res = await agent.post("/api/status/new").send({ caption: "Feeling good", ownerId: userId });

    expect(res.status).toBe(201);
    expect(res.body.status.caption).toBe("Feeling good");
  });

  it("rejects creating a status without authentication (failure case)", async () => {
    const res = await request(app)
      .post("/api/status/new")
      .send({ caption: "Should fail", ownerId: "507f1f77bcf86cd799439011" });

    expect(res.status).toBe(401);
  });

  it("lists all active statuses (happy path)", async () => {
    const { agent, userId } = await registerAndLogin("statuslist", "statuslist@test.com");
    await agent.post("/api/status/new").send({ caption: "One", ownerId: userId });

    const res = await request(app).get("/api/status/all");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.statuses)).toBe(true);
    expect(res.body.statuses.length).toBeGreaterThan(0);
  });

  it("marks a status as seen by a user (happy path)", async () => {
    const { agent, userId } = await registerAndLogin("statusseen", "statusseen@test.com");
    const createRes = await agent.post("/api/status/new").send({ caption: "Seen test", ownerId: userId });
    const statusId = createRes.body.status._id;

    const res = await agent.post(`/api/status/${statusId}/seen`).send({ userId });

    expect(res.status).toBe(200);
    expect(res.body.status.seenBy).toContain(userId);
  });

  it("returns 404 when marking a nonexistent status as seen (failure case)", async () => {
    const { agent, userId } = await registerAndLogin("statusmissing", "statusmissing@test.com");
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await agent.post(`/api/status/${fakeId}/seen`).send({ userId });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No status with this id");
  });
});
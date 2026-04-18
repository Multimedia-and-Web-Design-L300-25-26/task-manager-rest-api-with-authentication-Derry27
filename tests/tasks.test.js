import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Task from "../src/models/Task.js";
import connectDB from "../src/config/db.js";

describe("Task Routes", () => {
  let token;
  let taskId;

  beforeAll(async () => {
    // Connect to MongoDB
    await connectDB();
    
    // Clear db
    await User.deleteMany({});
    await Task.deleteMany({});
    
    // Register
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "taskuser" + Date.now(),
        email: "tasktest" + Date.now() + "@example.com",
        password: "password123"
      });

    // Login
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "tasktest" + Date.now() + "@example.com",
        password: "password123"
      });

    token = loginRes.body.token;
  }, 40000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should not allow access without token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  }, 15000);

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Test Description"
      });

    expect(res.status).toBe(201);
    taskId = res.body._id;
  }, 15000);

  it("should get user tasks only", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  }, 15000);
});
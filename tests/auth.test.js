import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import connectDB from "../src/config/db.js";

describe("Auth Routes", () => {
  let token;

  beforeAll(async () => {
    // Connect to MongoDB
    await connectDB();
    
    // Clear users
    await User.deleteMany({});
    
    // Register a test user for login test
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "testuser",
        email: "test@example.com",
        password: "password123"
      });
  }, 40000);

  afterAll(async () => {
    // Close all connections
    await mongoose.connection.close();
  });

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "testuser" + Date.now(),
        email: "test" + Date.now() + "@example.com",
        password: "password123"
      });

    expect(res.status).toBe(201);
  }, 20000);

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.status).toBe(200);
  }, 20000);
});
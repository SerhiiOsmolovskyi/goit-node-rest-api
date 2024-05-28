import mongoose from "mongoose";
import request from "supertest";
import { findUser, deleteAllUsers } from "../services/authServices.js";
import app from "../app.js";

const { DB_TEST_HOST, PORT = 3000 } = process.env;

describe("test /api/users/register", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteAllUsers();
  });

  test("test singup with correct data", async () => {
    const signupData = {
      email: "test_test@gmail.com",
      //   password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/users/register")
      .send(signupData);

    expect(statusCode).toBe(201);

    expect(body.email).toBe(signupData.email);
    // expect(body.subscription).toBe(signupData.subscription);

    const user = await findUser({ email: signupData.email });
    expect(user).not.toBeNull();
    // expect(user.username).toBe(signupData.username);
    expect(user.email).toBe(signupData.email);
  });
});

describe("test /api/users/login", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteAllUsers();
  });

  test("test singin with correct data", async () => {
    const signinData = {
      email: "nataly@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(signinData);

    expect(statusCode).toBe(200);
    expect(body.email).toBe(signinData.email);
    expect(body.subscription).toBe(signinData.subscription);

    const user = await findUser({ email: signinData.email });
    expect(user).not.toBeNull();
    expect(user.email).toBe(signinData.email);
    expect(user.subscription).toBe(signinData.subscription);
  });
});

require("dotenv").config();

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/user");

mongoose.set("strictQuery", false);

const { DB_TEST_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_URI);

    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_TEST_URI);
  });

  it("should login user", async () => {
    const response = await supertest(app).post("/api/auth").send({
      email: "test@gmail.com",
      password: "000000",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.user.token).toBe("test@gmail.com");
    expect(response.body.data.user.email).toBe("test@gmail.com");
    expect(response.body.data.user.subscription).toBe("test@gmail.com");
  });
});

require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const { User } = require('../service/user.js');

const dummyUser = {
  _id: null,
  email: "test@test.com",
  password: "Test12345678",
  subscription: "starter",
};

describe("user login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_HOST, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
    });

	await User.findOneAndDelete({ email: dummyUser.email });
	const { _id } = new User({
	  email: dummyUser.email,
	  password: bcrypt.hashSync(dummyUser.password, bcrypt.genSaltSync(6)),
	  subscription: dummyUser.subscription,
	}).save();
	dummyUser._id = _id;
  });

  afterAll(async () => {
  await User.findOneAndDelete({ email: dummyUser.email });
  await mongoose.disconnect();
  });

  test("valid data should properly log the user in", async () => {
	const { status, text: token }  = await request(app).post("/users/login").send({
	  email: dummyUser.email,
	  password: dummyUser.password,
	});

    expect(status).toBe(200);
	expect(typeof token).toBe("string");
	expect(token).toBeTruthy();
  });

  test("invalid email should return 401", async () => {
	const { status } = await request(app).post("/users/login").send({
	  email: "wrong@gmail.com",
	  password: dummyUser.password,
	});

	expect(status).toBe(401);
  });

  test("broken email should return 400", async () => {
	const { status } = await request(app).post("/users/login").send({
	  email: "123",
	  password: dummyUser.password,
	});

	expect(status).toBe(400);
  });
});
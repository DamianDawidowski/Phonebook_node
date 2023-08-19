const express = require('express')
const router = express.Router()
const { User, hashPassword, userValidationSchema }  = require('../service/user')
const handleLogin = require('../service/authorization')
const auth = require('../service/authorization')
require('dotenv').config()

 
const createUser = async (password, email, subscription, token) => {
  const hashedPassword = hashPassword(password); 
  const user = new User({
    password: hashedPassword,
    email,
    subscription,
    token,
      });
      user.save();
      return user;
    }  ;
 
const getAllUsers = async () => {
  const users = await User.find();
  return users;
  };
  
const getUserById = async (_id) => {
  const user = await User.findOne({ _id });
  return user;
  };
  
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
  };
  
const addUserToken = async (id, token) => {
  return User.findByIdAndUpdate(id, { token });
  };
  
const removeUserToken = async (_id) => {
  return User.findOneAndUpdate(_id, { token: null });
  };
 
router.post("/signup", async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
    }
  try {
    const { password, email, subscription } = req.body;
    const isEmailUnique = await getUserByEmail(email);
    if (!isEmailUnique) {
      return res.status(409).send(`Email ${email} in use`);
      }
    const user = await createUser(password, email, subscription);
    return res.status(201).json(user);
    } catch (err) {
      return res.status(500).send("Something went wrong");
    }
  });

router.post("/login", async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } 
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
    }
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(400).send("User not found!!!");
    }
  try {
    const token = await handleLogin(email, password);
    return res.status(200).send(token);
    } catch (err) {
      return res.status(401).send("Email or password is wrong");
    }
});
 
router.get("/logout", auth, async (req, res) => {
  try {
    const { _id } = await req.user;
    const user = await getUserById({ _id });
    if (!user) {
      return res.status(401).send("Not authorized");
      }
    await removeUserToken(_id);
    res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
  
router.get("/current", auth, async (req, res, next) => {
  const { id } = req.user;
  const user = await getUserById(id);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
    } else {
      const userData = {
        email: user.email,
        subscription: user.subscription,
      };
      res.status(200).json(userData);
    }
  });
 
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    addUserToken,
    removeUserToken,
    getUserByEmail,
    router
  };
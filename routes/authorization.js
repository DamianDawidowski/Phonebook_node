const express = require("express");
const { auth, handleLogin } = require("../service/authorization");
const { userValidationSchema} = require("../service/user");
const { getUserByEmail, createUser, getUserById, removeUserToken, getAllUsers, updateAvatar } = require("../service/functions"); 
const router = express.Router();
const gravatar = require('gravatar');
const { upload, storeImage, uploadDir } = require("../service/fileUpload"); 
const Jimp = require("jimp");
 
router.post("/signup", async (req, res) => { 
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const { password, email, subscription } = req.body;
    const isEmailOccupied = await getUserByEmail(email);
    if (isEmailOccupied) {
      return res.status(409).send(`Email ${email} in use`);
    }
    const avatarURL = gravatar.url(email, {s: '200', r: 'pg', d: '404'});
    const user = await createUser(password, email, subscription, avatarURL);
    return res.status(200).json(user);
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
    return res.status(401).send("User not found");
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
      avatarURL: user.avatarURL
    };
    res.status(200).json(userData);
  }
});
 
router.patch('/avatars', auth, upload.single('avatar'), async (req, res, next) => { 
  const { _id } = req.user; 
  const originalName = req.file.filename;
  const avatarURL = `avatar/${_id}_${originalName}` 
  Jimp.read(`${uploadDir}/${originalName}`)
  .then((avatar) => {
    return avatar
      .resize(250, 250)  
      .write(`${storeImage}/${_id}_${originalName}`); 
  })
  .catch((err) => {
    console.error(err);
  }); 
  updateAvatar(_id, avatarURL) 
  return res.status(200).json({
    status: "success",
    code: 200,
    message: "OK",
    data: {
      avatarURL: avatarURL,
    },
  }); 
});
  
router.get("/", auth, async (req, res, next) => { 
  try {
    const results = await getAllUsers();
    res.status(200).json({
    status: "success",
    code: 200,
    message: "OK",
    data: {
      users: results,
    },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
 
module.exports = router;

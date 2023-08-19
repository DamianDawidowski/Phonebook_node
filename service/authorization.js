const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getUserByEmail, addUserToken, getUserById } = require("./functions");
const secret = process.env.JWT_SECRET;
// const { getUserByEmail, addUserToken, getUserById } = require("../routes/authorization");

const createToken = (user) => {
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, secret);
  return token;
};
  
const handleLogin = async (email, password) => {
  const user = await getUserByEmail(email);
  const userPassword = user.password;
  const result = bcrypt.compareSync(password, userPassword);
  if (result) {
    const token = createToken(user);
    await addUserToken(user._id, token);
    return token;
  }  
};

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log('token is: '+token)
  if (!token) {
    return res.status(401).send("Not authorized");
  }
  try {
    const { id } = jwt.verify(token, secret);
    const user = await getUserById(id);
    if (user && user.token === token) {
      req.user = user;
      next();
    } else {
      return res.status(401).send("Not authorized");
    }
    } catch (err) {
      return res.status(401).send("Not authorized");
    }
  };
 
module.exports = { handleLogin, auth };
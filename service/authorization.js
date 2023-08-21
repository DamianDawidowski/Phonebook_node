const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require('passport');
const { getUserByEmail, addUserToken } = require("./functions");
const secret = process.env.JWT_SECRET; 
 
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
 
const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => { 
    if (!user || err) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};
 
module.exports = { handleLogin, auth };
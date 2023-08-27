const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require('passport');
const sgMail = require('@sendgrid/mail'); 
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
    if (!user || err || !user.verify) {
      console.log(user.verify)
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};
 
const sendEmail = async (email, verificationToken) => { 
  sgMail.setApiKey(process.env.SGMAIL_KEY);
  const msg = {
    to: email, 
    from: process.env.OWN_EMAIL,
    subject: `Sending verification email`,
    html: `<p>Click <a href="http://localhost:3000/users/verify/${verificationToken}">here </a> to verify your account</p>`
  };   
   await sgMail.send(msg); 
  } 
  
module.exports = { handleLogin, auth, sendEmail };
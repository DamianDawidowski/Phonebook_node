const { User, hashPassword } = require("./user");
 
const createUser = async (password, email, subscription, avatarURL, verificationToken) => {
  const hashedPassword = hashPassword(password); 
  const user = new User({
    password: hashedPassword,
    email,
    subscription,
    avatarURL,
    verificationToken
  });
  user.save();
  return user;
};
  
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

const getUserByVerificationToken = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  return user;
};

const updateVerificationToken = async (verificationToken) => { 
  return User.findOneAndUpdate({ verificationToken }, { verificationToken: null, verify: 'true' });
}; 
    
const addUserToken = async (id, token) => {
  return User.findByIdAndUpdate(id, { token });
};
    
const removeUserToken = async (_id) => {
  return User.findOneAndUpdate(_id, { token: null });
}; 

const updateAvatar = async (_id, avatarURL) => { 
  return User.findOneAndUpdate(_id, { avatarURL });
}; 
  
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByVerificationToken,
  updateVerificationToken,
  addUserToken,
  removeUserToken,
  getUserByEmail,
  updateAvatar
};
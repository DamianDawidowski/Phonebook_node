const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
const Joi = require("joi"); 
const Schema = mongoose.Schema;

const userSchema = new Schema({  
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      } 
});
 
const hashPassword = (pass) => { 
  const hashedPassword = bCrypt.hashSync(pass, bCrypt.genSaltSync(6));
  return hashedPassword;
  };
 
userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.password);
  };
  
const User = mongoose.model("user", userSchema);
  
const userValidationSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
  token: Joi.string(),
  });
  
module.exports = { User, hashPassword, userValidationSchema };
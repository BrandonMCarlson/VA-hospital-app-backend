const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
  location: { type: String, required: true },
});

const Profile = mongoose.model("Profile", profileSchema);

const validateProfile = (profile) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    location: Joi.string().required(),
  });
  return schema.validate(profile);
};

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
  location: { type: String, required: false, minlength: 2, maxlength: 1024 },
  email: { type: String, required: true, minlength: 5,  maxlength: 255},
  password: { type: String, required: true, minlength: 2, maxlength: 1024 },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    },
    config.get("jwtSecret")
  );
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    location: Joi.string().min(2).max(1024),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
};

const validateLogin = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(req);
};

exports.User = User;
exports.Profile = Profile;
exports.validateUser = validateUser;
exports.validateLogin = validateLogin;
exports.validateProfile = validateProfile;

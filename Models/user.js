const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const { string } = require("joi");


const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
  appointment: {type: Object, required: false},
  favFacility: {type: Object, required: false},
});

const Profile = mongoose.model("Profile", profileSchema);

const validateProfile = (profile) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    appointment: Joi.object({}),
    favFacility: Joi.object({}),
  });
  return schema.validate(profile);
};

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, minlength: 5,  maxlength: 255},
  password: { type: String, required: true, minlength: 2, maxlength: 1024 },
  isAdmin: { type: Boolean, default: false },
  appointment: {type: Object, requried: false, default: false},
  favFacility: {type: Object, required: false, default: false},
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      appointment: this.appointment,
      favFacility: this.favFacility,
    },
    config.get("jwtSecret")
  );
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    appointment: Joi.object({}),
    favFacility: Joi.object({}),
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

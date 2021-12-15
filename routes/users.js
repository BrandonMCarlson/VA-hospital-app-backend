const {User, validateUser, validateLogin } = require("../models/user");
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');



router.post("/register", [auth, admin],  async (req, res) => {
    try {
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).send("User already registered.");
      const salt = await bcrypt.genSalt(10);
      user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt),
      });
      await user.save();
      const token = user.generateAuthToken();
      return res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  }
);


router.post("/login", [auth, admin],  async (req, res) => {
    try {
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      let user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send(`Invalid email or password.`);
  
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(400).send("Invalid email or password.");
  
      const token = user.generateAuthToken();
      return res.send(token);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

  router.get("/",  async (req, res) => {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

  router.put('/:userId', auth, async (req, res) => {
    try {
      const { error } = validateUser(req.body)
      if (error) return res.status(400).send(error)
  
      const user = await User.findById(req.params.userId)
      if (!user) return res.status(400).send(
        `The user with id: "${req.params.userId}" does not exist.`
        )
  
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.location = req.body.location;
      user.email = req.body.email;
      user.password = req.body.password;
  
      await user.save()
      return res.send(user)
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

router.delete("/:userId", auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user)
        return res
          .status(400)
          .send(`User with id ${req.params.userId} does not exist!`);
      await user.remove();
      return res.send(user);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

  module.exports = router
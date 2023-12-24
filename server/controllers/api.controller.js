const asyncHandler = require("express-async-handler");
const { validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");

exports.loginPost = [
  body("username", "Invalid username")
    .trim()
    .isAlphanumeric()
    .isLength({ min: 3, max: 18 })
    .escape(),
  body("password", "Invalid Password")
    .trim()
    .isString()
    .isLength({ min: 8, max: 20 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ result: false, message: errors });
    }
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      res.json({ result: false, message: "Username doesn't exist" });
      // res.end();
    }
    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.json({ result: false, message: "Wrong password" });
    }

    const token = jwt.sign({ username }, process.env.secret);
    res.json({ result: true, token, message: "success" });
  }),
];

exports.signupPost = [
  body("username", "Invalid username")
    .trim()
    .isAlphanumeric()
    .isLength({ min: 3, max: 18 })
    .escape(),
  body("password", "Invalid Password")
    .trim()
    .isString()
    .isLength({ min: 8, max: 20 })
    .escape(),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ username }).exec();
    const user = new User({ username, password: hashedPassword });
    const errors = validationResult(req);
    if (existingUser) {
      res.json({ result: false, message: "Username already exists" });
      // res.end();
    } else if (!errors.isEmpty()) {
      res.json({ result: false, message: errors });
    }
    await user.save();
    res.json({ result: true, message: "user created successfully" });
  }),
];

const asyncHandler = require("express-async-handler");
const { validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const Post = require("../models/Post.js");

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

exports.getFeed = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    const feed = await Post.find({
      author: { $in: req.user.following },
    }).exec();
    res.json({ result: true, feed, message: "success" });
  }),
];

exports.createPost = [
  body("content", "invalid content").trim().isLength({ max: 500 }).escape(),
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    const post = new Post({
      author: req.user.username,
      content: req.body.content,
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors);
    }
    await post.save();
  }),
];

exports.likePost = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.body.postId).exec();
    if (!post) {
      res.send("post not found");
    }
    post.likes.push(req.user);
    req.user.likes.push(post);
    await post.save();
    await req.user.save();
  }),
];

exports.followUser = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    const user = await Post.findOne({ username: req.body.username }).exec();
    if (!user) {
      res.send("user not found");
    }
    user.followers.push(req.user);
    req.user.following.push(user);
    await user.save();
    await req.user.save();
  }),
];

exports.test = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res) => {
    const test = await new User({ username: "test1", password: "test1" });
    req.user.followers.push(test);
    await req.user.save();
    res.send(req.user);
  }),
];

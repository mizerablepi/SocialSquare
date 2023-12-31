const express = require("express");
const router = express.Router();
const controller = require("../controllers/social.controller.js");

router.post("/login", controller.loginPost);
router.post("/signup", controller.signupPost);
router.post("/follow", controller.followUser);
router.post("/like", controller.likePost);
router.post("/create", controller.createPost);

router.get("/feed", controller.getFeed);

router.get("/test", controller.test);

module.exports = router;

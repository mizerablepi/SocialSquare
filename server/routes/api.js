const express = require("express");
const router = express.Router();
const controller = require("../controllers/api.controller.js");

router.post("/login", controller.loginPost);
router.post("/signup", controller.signupPost);

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../controllers/User.js");

router.post("/signup/:type", User.addUser);
router.post("/login", User.Login);
router.post("/signup", User.SignUp);
router.post("/get/user", User.getUser);
router.patch("/edit/user", User.editUser);

module.exports = router;

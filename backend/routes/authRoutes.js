const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

//these are the two routes for the user
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

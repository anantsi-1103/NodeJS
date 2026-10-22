const express = require("express");
const router = express.Router();
const {registerUser,loginUser,getMe} = require("../controllers/AuthController")
// middleware

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/me", getMe) // protected route

module.exports = router
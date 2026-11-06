const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logout} = require("../controller/AuthController")
const upload = require("../middlewares/uploadMiddleware")


// middleware
router.post("/register",upload.single("avatar"), registerUser)
router.post("/login", loginUser)
router.get("/logout", logout) // protected route

module.exports = router
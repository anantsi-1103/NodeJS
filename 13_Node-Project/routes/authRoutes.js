const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logout} = require("../controllers/AuthController")
const {protect} = require("../middlewares/authMiddleware")


// middleware
router.post("/register",upload.single("avatar"), registerUser)
router.post("/login", loginUser)
router.get("/logout", logout) // protected route

module.exports = router
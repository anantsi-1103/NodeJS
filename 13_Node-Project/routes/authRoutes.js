const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout, getMe } = require("../controller/AuthController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;

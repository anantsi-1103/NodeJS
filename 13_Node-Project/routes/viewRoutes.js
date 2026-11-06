const express = require("express")
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware")
const Task = require("../models/Task")

router.get("/", (req, res) => res.redirect("/dashboard"))
router.get("/login", (req, res) => res.render("login", { title: "Login" }))
router.get("/register", (req, res) => res.render("register", { title: "Register" }))

// Protected Dashboard Page
router.get("/dashboard", protect, async (req, res) => {
    // with help of populate , it automatically embed creator name and avatar
    const tasks = await Task.find().populate("user", "name avatar").sort({ createdAt: -1 });

    res.render("dashboard", {
        title: "TaskPulse Dashboard",
        user: req.user,
        tasks
    })
})

module.exports = router
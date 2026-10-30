const express = require("express")
const router = express.Router();
const User = require("../model/User")


// 1. HOME PAGE


// get 

router.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
        username: "Virat Kohli",
        message: "This entire page is Home Page and was rendered by Using EJS Template Engine",
        role: "Developer"
    })
})


// get / user

router.get("/users", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 })

        res.render("users", {
            title: "Users List",
            users: users
        })
    }
    catch (error) {
        res.status(500).send("Error Fetching Users : " + error.message);
    }
})


// 3. render add user form
// get /add-user

router.get("/add-user", (req, res) => {
    res.render("add-user", {
        title: "Add User"
    })
})


// post -> Form submission

router.post("/add-user", async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        await User.create({ name, email, password, role });

        // redirect to user
        res.redirect("/users")

    } catch (error) {
        res.status(400).send("Error Creating User: " + error.message)
    }
})

module.exports = router;
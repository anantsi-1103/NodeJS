const User = require("../models/User");
const jwt = require("jsonwebtoken")



const sendCookieToken = (user, statusCode, res, redirectURL = null) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || process.env.JWT_Secret, {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
        httpOnly: true, // secure
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    if (redirectURL) {
        return res.redirect(redirectURL)
    }

    res.status(statusCode).json({
        success: true, user
    });
}






// helper function to generate jwt token
const generateToken = (userID, role) => {
    return jwt.sign(
        {
            id: userID, role: role  // payload
        },
        process.env.JWT_SECRET || process.env.JWT_Secret, // secret key
        {
            expiresIn: process.env.JWT_EXPIRE || "30d"
        }
    )
}

// 1. Register User -> 
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check if user already exist
        const userExist = await User.findOne({ email }) // find user by id
        if (userExist) {
            return res.status(400).send("User Already Exists. <a href='/login'> Login Here </a> ")

        }

        const avatarPath = req.file ? `/uploads/${req.file.filename}` : "/uploads/default-avatar.png"
        // create user -> (password will automatically hash ke threw convert hjojaega)
        const user = await User.create({ name, email, password, role, avatar: avatarPath });
        sendCookieToken(user, 201, res, "/dashboard")

        // generate token
        const token = generateToken(user._id, user.role)
    }
    catch (error) {
        res.status(400).send("Error Registering : " + error.message)
    }
}

// 2. Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find User & Explicity select password -> schema select false
        const user = await User.findOne({ email }).select("+password")

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).send("Invalid Email or Password. <a href='/login'> Try Again </a>")

        }
        sendCookieToken(user, 200, res, "/dashboard");
    }
    catch (error) {
        res.status(500).send("Error Logging in : " + error.message)
    }
}

// Logout
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};


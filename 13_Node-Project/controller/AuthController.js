const User = require("../models/User");
const jwt = require("jsonwebtoken");

const sendCookieToken = (user, statusCode, res, redirectURL = "/dashboard", req = null) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "taskpulse_super_secret_jwt_key_987654321",
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    // If client expects JSON (e.g. Fetch API or Postman)
    if (req && (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json"))) {
        return res.status(statusCode).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    }

    // Default for browser form submission
    if (redirectURL) {
        return res.redirect(redirectURL);
    }

    res.status(statusCode).json({ success: true, token, user });
};

// 1. Register User (POST /api/auth/register)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            if (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json")) {
                return res.status(400).json({ success: false, message: "Please provide all required fields" });
            }
            return res.status(400).send("Please fill in all fields. <a href='/register'>Try Again</a>");
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            if (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json")) {
                return res.status(400).json({ success: false, message: "User already exists with this email" });
            }
            return res.status(400).send("User Already Exists. <a href='/login'>Login Here</a>");
        }

        const avatarPath = req.file ? `/uploads/${req.file.filename}` : "/uploads/default-avatar.png";
        const user = await User.create({ name, email, password, role: role || "Member", avatar: avatarPath });

        sendCookieToken(user, 201, res, "/dashboard", req);
    } catch (error) {
        if (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json")) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(400).send("Error Registering: " + error.message);
    }
};

// 2. Login User (POST /api/auth/login)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            if (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json")) {
                return res.status(400).json({ success: false, message: "Please provide email and password" });
            }
            return res.status(400).send("Please provide email and password. <a href='/login'>Try Again</a>");
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            if (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json")) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }
            return res.status(401).send("Invalid Email or Password. <a href='/login'>Try Again</a>");
        }

        sendCookieToken(user, 200, res, "/dashboard", req);
    } catch (error) {
        if (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json")) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.status(500).send("Error Logging in: " + error.message);
    }
};

// 3. Get Current Logged In User (GET /api/auth/me)
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};

// 4. Logout User (GET /api/auth/logout)
exports.logout = (req, res) => {
    res.clearCookie("token");
    if (req.xhr || req.headers["accept"]?.includes("application/json") || req.is("json")) {
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    res.redirect("/login");
};

const jwt = require("jsonwebtoken")
const User = require("../models/User")


// 1. protect middleware -> verifies if user is logged in 
exports.protect = async (req, res, next) => {
    let token;

    // check if token exists in cookies or Bearer auth header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        if (req.accepts("html")) return res.redirect("/login");
        return res.status(401).json({ success: false, message: "Not Authorized to access this route" });
    }

    try {
        // verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_Secret);

        // fetch user from DB  -> Excluding password
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.clearCookie("token");
            if (req.accepts("html")) return res.redirect("/login");
            return res.status(401).json({ success: false, message: "User not found" });
        }

        next(); // allow the request to proceed with the controller
    } catch (error) {
        res.clearCookie("token");
        if (req.accepts("html")) return res.redirect("/login");
        return res.status(401).json({ success: false, message: "Session Expired, Please Login Again" });
    }
}

// authorize role -> // restriction acess to the specific roles only
exports.adminOnly = (req, res, next) => {
    if (req.user?.role !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: "Admin Access Required for this action"
        })
    }
    next()
}
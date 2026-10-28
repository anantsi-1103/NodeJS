const jwt = require("jsonwebtoken");
const User = require("../model/User");

// 1. protect middleware -> verifies if user is logged in 
exports.protect = async (req, res, next) => {
    let token;

    // check if auth exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // extract token
            token = req.headers.authorization.split(" ")[1];

            if (!token) {
                return res.status(401).json({ success: false, message: "Not Authorized to access this route" });
            }

            // verify token using secret key
            const secret = process.env.JWT_SECRET || process.env.JWT_Secret;
            const decoded = jwt.verify(token, secret);

            // fetch user from DB -> excluding password
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ success: false, message: "User belonging to this token no longer exists!!!" });
            }

            return next(); // allow the request to proceed with the controller
        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized to access this route" });
    }
};

// 2. authorize role -> restriction access to specific roles only
exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            const role = req.user ? req.user.role : "Unknown";
            return res.status(403).json({ success: false, message: `User Role ${role} is not authorized to perform this action` });
        }
        next();
    };
};

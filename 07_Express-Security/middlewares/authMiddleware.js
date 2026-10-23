const jwt = require("jsonwebtoken")
const User = require("../model/User")


// 1. protect middleware -> verifies if user is logged in 
exports.protect = async (req, res, next) => {
    let token;

    // check if auth exist and starts wit bearer
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // extract bearer from the token
            token = req.headers.authorization.split(" ")[1]

            // verify token using secret key
            const decoded = jwt.verify(token, process.env.JWT_Secret)

            // fetch user from DB  -> Excluding password
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ success: false, message: "User belonging to this token no longer exist!!!" })
            }

            next(); // allow the request to proceed with the controller
        }
        catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or Expired Token" })
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorzied to access this route" })

    }
}

// authorize role -> // restriction acess to the specific roles only
exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `User Role ${req.user.role} is not authorized to perform this action` })
        }
        next();
    }
}
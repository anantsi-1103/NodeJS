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


            if (!token) {
                if (req.accepts("html")) return res.redirect("/login")
                return res.status(401).json({ success: false, message: "Not Authorzied to access this route" })

            }

            // verify token using secret key
            const decoded = jwt.verify(token, process.env.JWT_Secret)

            // fetch user from DB  -> Excluding password
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                res.clearCookie("token")
                return res.redirect("/login")
            }

            next(); // allow the request to proceed with the controller
        }
        catch (error) {
            res.clearCookie("token")
            if (req.accepts("html")) return res.redirect("/login")
            return res.status(401).json({ success: false, message: "Session Expired, Please Login Again" })
        }
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
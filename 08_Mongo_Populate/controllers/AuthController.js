const User = require("../model/User");
const jwt = require("jsonwebtoken")

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
            return res.status(400).json({
                success: false,
                message: "User Already Registered with this Email!!!"
            })
        }
        // create user -> (password will automatically hash ke threw convert hjojaega)
        const user = await User.create({ name, email, password, role });

        // generate token

        const token = generateToken(user._id, user.role)


        res.status(201).json({
            success: true,
            message: "User Registered Successfully!!!",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// 2. Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please Provide email and password" })
        }

        // Find User & Explicity select password -> schema select false
        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Email and Password" })
        }

        // check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid Email and Password" })
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login Successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })


    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// 3. get current logged in user -> 
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}
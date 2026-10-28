const User = require("../model/User");


// 1. GET ALL USERS (with optional query filtering: ?role=developer)
exports.getAllUsers = async (req, res) => {
    try {

        const { role } = req.query;
        const queryFilter = role ? { role: new RegExp(role, "i") } : {};

        // fetch users from db
        const users = await User.find(queryFilter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    }
    catch (error) {
        res.status(500).json({
            success: false, message: error.message
        });
    }
};

// 2. CREATE USER (POST)
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: newUser
        })

    }
    catch (error) {
        if (error.code === 11000) { // duplicate entry
            return res.status(400).json({
                success: false,
                message: "Email Already Exist"
            })
        }

        res.status(400).json({ success: false, message: error.message })
    }
}

// 3. GET SINGLE USER BY ID (:id parameter)
exports.getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${req.params.id}`
            })
        }
        res.status(200).json({ success: true, data: user })
    }
    catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: "Invalid User ID Format" })
        }
        res.status(500).json({ success: false, message: error.message })
    }
};



// 4. UPDATE USER (PUT)
exports.updateUser = async (req, res) => {

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return updated document 
            runValidators: true
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${req.params.id}`
            })
        }
        res.status(200).json({ success: true, message: "Data Updated", data: user })
    }

    catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: "Invalid User ID Format" })
        }
        res.status(500).json({ success: false, message: error.message })
    }

}

// 5. DELETE USER (DELETE)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with the id ${req.params.id}`
            })
        }
        res.status(200).json({ success: true, message: "User DELETED" })
    }
    catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: "Invalid User ID Format" })
        }
        res.status(500).json({ success: false, message: error.message })
    }
};
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"],
            trim: true,
            minLength: [2, "Name must be at least 2 Character long"]
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please enter a valid Email Address"
            ]
        },
        password: {
            type: String,
            required: [true, "Password is Required"],
            minLength: [6, "Password must be at least 6 Characters long"],
            select: false
        },
        role: {
            type: String,
            required: [true, "Role is Required"],
            enum: ["Developer", "Designer", "Manager", "Intern","Admin"],
            default: "Developer"
        },
        age: {
            type: Number,
            min: [18, "Age must be at least 18"]
        }
    },
    {
        timestamps: true // automatically creates createdAt, updatedAt
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

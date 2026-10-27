const mongoose = require("mongoose")

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
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please enter a valid Email Address"]

        },
        role: {
            type: String,
            required: [true, "Role is Required"],
            enum: ["Developer", "Designer",
                "Manager", "Intern"
            ],

            default: "Developer",



        },
        age: {
            type: "Number",
            min: [18, "Age must be at least 18"]
        }

    },
    {
        timestamps: true // automatically creates a field name - createdAt, updateAt
    }
)

module.exports = mongoose.model("User", userSchema)
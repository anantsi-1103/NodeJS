const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task Title is Required"],
        trim: true,
        maxLength: [100, "Title Cannot be more than 100 Characters"]
    },

    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"

    },

    // Relationship link : Reference to the user who created this task
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true // automatically creates a field name - createdAt, updateAt
    }

)


module.exports = mongoose.model("Task", taskSchema)
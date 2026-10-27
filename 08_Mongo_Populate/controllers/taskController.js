const Task = require("../model/Task")

// 1. Create a Task
// Post -> 
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is Required" });
        }

        // Attach login user
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
            data: task
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};


// get all task -> populate 
exports.getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("user", "name email role avatar")
            .sort({ createAt: -1 })


        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// get task by id
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(400).json({ success: false, message: "Task Not found" });
        }

        res.status(200).json({
            success : true,
            data : task
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// update / delete + Security -> 

// Socket - 


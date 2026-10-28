const Task = require("../model/Task");

// 1. Create a Task (POST)
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, user } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is Required" });
        }

        // Support user from auth middleware (if present) or request body
        const userId = req.user ? req.user._id : user;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            user: userId
        });

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get all tasks with populated user
exports.getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get task by id with populated user
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("user", "name email role");

        if (!task) {
            return res.status(404).json({ success: false, message: "Task Not found" });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: "Invalid Task ID Format" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. UPDATE USER (PUT)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate("user", "name email role");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `Task not found with ID ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            message: `Task Updated`,
            data: task
        })

    }
    catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: `Invalid Task ID Format` });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

// 5. DELETE USER (DELETE)
exports.deleteTask = async (req, res) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: `Task not found with ID ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            message: `Task Deleted`,
            data: task
        })
    }
    catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: `Invalid Task ID Format` });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
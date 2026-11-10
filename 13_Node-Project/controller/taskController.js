const Task = require("../models/Task");

// 1. Create a Task (POST /api/tasks)
exports.createTask = async (req, res) => {
    try {
        const { title, priority } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const userId = req.user ? req.user._id : req.body.user;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const task = await Task.create({
            title,
            priority: priority || "Medium",
            user: userId
        });

        const populatedTask = await Task.findById(task._id).populate("user", "name avatar role email");

        // Broadcast real-time event to all connected clients
        const io = req.app.get("socketio");
        if (io) io.emit("taskCreated", populatedTask);

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: populatedTask
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get all tasks (GET /api/tasks)
exports.getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("user", "name avatar role email")
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

// 3. Get task by ID (GET /api/tasks/:id)
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("user", "name avatar role email");

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: "Invalid Task ID format" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Update task status (PUT /api/tasks/:id/status)
exports.updateTask = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "In Progress", "Completed"];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(", ")}`
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate("user", "name avatar role email");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: `Task not found with ID ${req.params.id}`
            });
        }

        // Broadcast real-time update event
        const io = req.app.get("socketio");
        if (io) io.emit("taskUpdated", task);

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            data: task
        });
    } catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: "Invalid Task ID format" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Delete task (DELETE /api/tasks/:id) - Admin Only
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: `Task not found with ID ${req.params.id}`
            });
        }

        // Broadcast real-time delete event
        const io = req.app.get("socketio");
        if (io) io.emit("taskDeleted", req.params.id);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: task
        });
    } catch (error) {
        if (error.name === "CastError" || error.kind === "ObjectId") {
            return res.status(400).json({ success: false, message: "Invalid Task ID format" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

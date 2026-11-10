const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
    getAllTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controller/taskController");

// All task routes require authentication
router.use(protect);

router.get("/", getAllTask);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id/status", updateTask);
router.delete("/:id", adminOnly, deleteTask); // 🔒 Admin Only

module.exports = router;

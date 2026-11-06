const express = require("express")
const router = express.Router()
const {protect, adminOnly} = require("../middlewares/authMiddleware")
const {createTask, updateTask, deleteTask} = require("../controller/taskController")

// const {protect} = 

router.use(protect)

router.post("/", createTask)
router.put("/:id/status", updateTask)
router.delete("/:id", adminOnly, deleteTask) // adminOnly

module.exports = router
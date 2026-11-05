const express = require("express")
const router = express.Router()
const {protect, adminOnly} = require("../middlewares/authMiddleware")
const {createTask, updateTask, deleteTask} = require("../controller/taskController")


const {

    createTask,
    updateTask,
    deleteTask

} = require("../controllers/taskController")

const { protect } = require("../middlewares/authMiddleware")
// const {protect} = 

router.use(protect)

router.post("/", createTask)
router.put("/:id/status", updateTask)
router.delete("/:id", adminOnly, deleteTask) // adminOnly

module.exports = router
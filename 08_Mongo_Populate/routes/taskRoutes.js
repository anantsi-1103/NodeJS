const express = require("express")
const router = express.Router()


const {

    createTask,
    getAllTask,
    getTaskById,
    updateTask,
    deleteTask

} = require("../controllers/taskController")

const { protect } = require("../middlewares/authMiddleware")
// const {protect} = 

router.use(protect)

router.route("/")
    .get(getAllTask)
    .post(createTask)


router.route("/:id")
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask)

module.exports = router
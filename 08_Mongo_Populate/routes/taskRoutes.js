const express = require("express")
const router = express.Router()


const {

    createTask,
    getAllTask,
    getTaskById

} = require("../controllers/taskController")

// const {protect} = 

router.route("/")
    .get(getAllTask)
    .post(createTask)


router.route("/:id")
    .get(getTaskById)

module.exports = router
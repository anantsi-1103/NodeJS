const express = require("express");
const router = express.Router();
const{
    getAllUsers,createUser,getUserById, deleteUser, updateUser
} = require("../controllers/userController")

// middlware



// Clean REST route chaining:
router.route("/")
    .get(getAllUsers)

router.route("/:id")
    .get(getUserById)
    .delete(deleteUser) // only admin can delete
    .put(updateUser) 



module.exports = router;
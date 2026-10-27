const express = require("express");
const router = express.Router();
const{
    getAllUsers,createUser,getUserById, deleteUser, updateUser
} = require("../controllers/userController")



// Clean REST route chaining:
router.route("/")
    .get(getAllUsers)
    .post(createUser);

router.route("/:id")
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser)



module.exports = router;
const express = require("express");
const router = express.Router();
const {
    getAllUsers, createUser, getUserById, deleteUser, updateUser
} = require("../controllers/userController")

// middlware
const { protect, authorizeRole } = require("../middlewares/authMiddleware")

// any line below this line require a token to be proceeded
router.use(protect)

// Clean REST route chaining:
router.route("/")
    .get(getAllUsers)
    .post(createUser)

router.route("/:id")
    .get(getUserById)
    .put(updateUser)
    .delete(authorizeRole("Admin"), deleteUser) // only admin can delete



module.exports = router;
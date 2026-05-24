const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController.js");

const protect = require("../middleware/authMiddleware.js");

const adminMiddleware = require("../middleware/adminMiddleware.js");

// GET ALL USERS
router.get("/", protect, adminMiddleware, getAllUsers);

// UPDATE USER ROLE
router.put("/:id", protect, adminMiddleware, updateUserRole);

// DELETE USER
router.delete("/:id", protect, adminMiddleware, deleteUser);

module.exports = router;

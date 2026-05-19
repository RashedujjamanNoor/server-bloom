const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const { getAdminStats } = require("../controllers/adminController.js");

router.get("/dashboard", protect, adminMiddleware, getAdminStats);

module.exports = router;

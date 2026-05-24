const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
  getAdminStats,
  getMonthlyAnalytics,
} = require("../controllers/adminController.js");

router.get("/dashboard", protect, adminMiddleware, getAdminStats);
router.get("/analytics", protect, adminMiddleware, getMonthlyAnalytics);

module.exports = router;

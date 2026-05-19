const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController.js");

//FOR USER
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.put("/cancel/:id", protect, cancelOrder);

// FOR ADMIN
router.get("/admin/all", protect, adminMiddleware, getAllOrders);
router.get("/admin/:id", protect, adminMiddleware, getSingleOrder);
router.put("/admin/:id", protect, adminMiddleware, updateOrderStatus);

module.exports = router;

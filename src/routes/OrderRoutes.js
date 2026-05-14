const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware.js");

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController.js");

// CREATE ORDER
router.post("/", protect, createOrder);

// GET MY ORDERS
router.get("/my-orders", protect, getMyOrders);

module.exports = router;

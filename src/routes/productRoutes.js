const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");

router.post("/", protect, adminMiddleware, createProduct);
router.put("/:id", protect, adminMiddleware, updateProduct);
router.delete("/:id", protect, adminMiddleware, deleteProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

module.exports = router;

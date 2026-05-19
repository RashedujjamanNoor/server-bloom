const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  currentUser,
  firebaseLogin,
} = require("../controllers/authController.js");
const protect = require("../middleware/authMiddleware.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/currentUser", protect, currentUser);
router.post("/firebase-login", firebaseLogin);

module.exports = router;

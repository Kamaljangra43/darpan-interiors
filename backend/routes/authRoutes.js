const express = require("express");
const {
  loginUser,
  getUserProfile,
  verifyAdmin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/auth/login
router.post("/login", loginUser);

// @route POST /api/auth/verify-admin
router.post("/verify-admin", verifyAdmin);

// @route GET /api/auth/profile
router.get("/profile", protect, getUserProfile);

module.exports = router;

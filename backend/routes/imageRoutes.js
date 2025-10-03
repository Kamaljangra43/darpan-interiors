const express = require("express");
const router = express.Router();
const {
  uploadImage,
  getImagesByCategory,
  deleteImage,
} = require("../controllers/imageController");
const { protect } = require("../middleware/authMiddleware");

// @route GET /api/images/:category
router.get("/:category", getImagesByCategory);

// @route POST /api/images/upload
router.post("/upload", protect, uploadImage);

// @route DELETE /api/images/:id
router.delete("/:id", protect, deleteImage);

module.exports = router;

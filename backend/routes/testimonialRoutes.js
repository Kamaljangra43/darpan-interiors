const express = require("express");
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect } = require("../middleware/authMiddleware");

// @route GET /api/testimonials
router.get("/", getTestimonials);

// @route POST /api/testimonials
router.post("/", protect, createTestimonial);

// @route PUT /api/testimonials/:id
router.put("/:id", protect, updateTestimonial);

// @route DELETE /api/testimonials/:id
router.delete("/:id", protect, deleteTestimonial);

module.exports = router;

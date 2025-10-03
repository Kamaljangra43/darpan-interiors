const express = require("express");
const router = express.Router();

// Add your testimonial routes here
router.get("/", (req, res) => {
  res.json({ message: "Testimonial routes" });
});

module.exports = router;

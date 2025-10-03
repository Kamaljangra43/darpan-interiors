const express = require("express");
const router = express.Router();

// Add your image routes here
router.get("/", (req, res) => {
  res.json({ message: "Image routes" });
});

module.exports = router;

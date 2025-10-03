const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateLogo,
  updateHeroImages,
} = require("../controllers/siteSettingsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getSettings);
router.put("/logo", protect, updateLogo);
router.put("/hero-images", protect, updateHeroImages);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getSiteImages,
  createSiteImage,
  updateSiteImage,
  deleteSiteImage,
} = require("../controllers/siteImageController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getSiteImages).post(protect, createSiteImage);
router
  .route("/:id")
  .put(protect, updateSiteImage)
  .delete(protect, deleteSiteImage);

module.exports = router;

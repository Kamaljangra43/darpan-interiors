const express = require("express");
const router = express.Router();
const {
  getStats,
  createStat,
  updateStat,
  deleteStat,
} = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getStats).post(protect, createStat);
router.route("/:id").put(protect, updateStat).delete(protect, deleteStat);

module.exports = router;

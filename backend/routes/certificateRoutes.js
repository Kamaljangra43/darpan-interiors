const express = require("express");
const router = express.Router();
const {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getCertificates);
router.get("/:id", getCertificateById);

// Admin routes
router.post("/", protect, admin, createCertificate);
router.put("/:id", protect, admin, updateCertificate);
router.delete("/:id", protect, admin, deleteCertificate);

module.exports = router;

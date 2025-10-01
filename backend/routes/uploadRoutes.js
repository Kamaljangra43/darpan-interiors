const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadImage, deleteImage } = require("../controllers/uploadController");

router.post("/", upload.single("image"), uploadImage);
router.delete("/:publicId", protect, deleteImage);

module.exports = router;

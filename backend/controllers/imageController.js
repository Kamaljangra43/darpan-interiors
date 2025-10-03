const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const Image = require("../models/imageModel");

// @desc Upload single image
// @route POST /api/images/upload
const uploadImage = asyncHandler(async (req, res) => {
  const { image, category, section, alt_text, title } = req.body;

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: `darpan-interiors/${category}`,
      transformation: [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    const newImage = await Image.create({
      url: result.secure_url,
      public_id: result.public_id,
      category,
      section: section || "",
      alt_text: alt_text || "",
      title: title || "",
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(400);
    throw new Error("Image upload failed");
  }
});

// @desc Get images by category
// @route GET /api/images/:category
const getImagesByCategory = asyncHandler(async (req, res) => {
  const images = await Image.find({ category: req.params.category });
  res.json(images);
});

// @desc Delete image
// @route DELETE /api/images/:id
const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);

  if (image) {
    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne();
    res.json({ message: "Image removed" });
  } else {
    res.status(404);
    throw new Error("Image not found");
  }
});

module.exports = { uploadImage, getImagesByCategory, deleteImage };

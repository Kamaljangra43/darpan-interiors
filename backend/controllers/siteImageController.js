const asyncHandler = require("express-async-handler");
const SiteImage = require("../models/siteImageModel");
const cloudinary = require("../config/cloudinary");
const { optimizeImage } = require("../utils/imageUtils");

// @desc Get all site images
// @route GET /api/site-images
// @access Public
const getSiteImages = asyncHandler(async (req, res) => {
  const { category, section } = req.query;

  let filter = { active: true };
  if (category) filter.category = category;
  if (section) filter.section = section;

  const images = await SiteImage.find(filter).sort({ order: 1, createdAt: -1 });

  // Optimize images based on category
  const optimizedImages = images.map((img) => {
    const plainImg = img.toObject ? img.toObject() : img;

    // Set different sizes based on category
    let width = 800,
      height = 600;
    if (plainImg.category === "logo") {
      width = 400;
      height = 400;
    } else if (plainImg.category === "hero") {
      width = 1920;
      height = 1080;
    }

    return {
      ...plainImg,
      image: optimizeImage(plainImg.image, width, height),
    };
  });

  res.json(optimizedImages);
});

// @desc Create site image
// @route POST /api/site-images
// @access Private
const createSiteImage = asyncHandler(async (req, res) => {
  const { category, section, title, image, altText, order, variant } = req.body;

  // Upload image to Cloudinary
  let imageData = null;
  if (image && image.startsWith("data:")) {
    const result = await cloudinary.uploader.upload(image, {
      folder: `darpan-interiors/${category}`,
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });
    imageData = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const siteImage = await SiteImage.create({
    category,
    section,
    title,
    image: imageData,
    altText: altText || title,
    order: order || 0,
    variant: variant || "",
  });

  res.status(201).json(siteImage);
});

// @desc Update site image
// @route PUT /api/site-images/:id
// @access Private
const updateSiteImage = asyncHandler(async (req, res) => {
  const siteImage = await SiteImage.findById(req.params.id);

  if (siteImage) {
    // Handle new image upload
    let imageData = siteImage.image;
    if (req.body.image && req.body.image.startsWith("data:")) {
      // Delete old image
      if (siteImage.image?.public_id) {
        await cloudinary.uploader.destroy(siteImage.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: `darpan-interiors/${req.body.category || siteImage.category}`,
      });
      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    siteImage.title = req.body.title || siteImage.title;
    siteImage.image = imageData;
    siteImage.altText = req.body.altText || siteImage.altText;
    siteImage.order =
      req.body.order !== undefined ? req.body.order : siteImage.order;
    siteImage.variant =
      req.body.variant !== undefined ? req.body.variant : siteImage.variant;

    const updatedImage = await siteImage.save();
    res.json(updatedImage);
  } else {
    res.status(404);
    throw new Error("Image not found");
  }
});

// @desc Delete site image
// @route DELETE /api/site-images/:id
// @access Private
const deleteSiteImage = asyncHandler(async (req, res) => {
  const siteImage = await SiteImage.findById(req.params.id);

  if (siteImage) {
    // Delete image from Cloudinary
    if (siteImage.image?.public_id) {
      await cloudinary.uploader.destroy(siteImage.image.public_id);
    }

    await siteImage.deleteOne();
    res.json({ message: "Image removed" });
  } else {
    res.status(404);
    throw new Error("Image not found");
  }
});

module.exports = {
  getSiteImages,
  createSiteImage,
  updateSiteImage,
  deleteSiteImage,
};

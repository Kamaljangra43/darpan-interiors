const asyncHandler = require("express-async-handler");
const SiteSettings = require("../models/siteSettingsModel");
const cloudinary = require("../config/cloudinary");

const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  res.json(settings);
});

const updateLogo = asyncHandler(async (req, res) => {
  const { image } = req.body;
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  // Delete old logo if exists
  if (settings.logo?.public_id) {
    await cloudinary.uploader.destroy(settings.logo.public_id);
  }

  // Upload new logo
  const result = await cloudinary.uploader.upload(image, {
    folder: "darpan-interiors/logo",
  });

  settings.logo = {
    url: result.secure_url,
    public_id: result.public_id,
  };

  await settings.save();
  res.json(settings);
});

const updateHeroImages = asyncHandler(async (req, res) => {
  const { images } = req.body;
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  // Upload images to Cloudinary
  const uploadedImages = await Promise.all(
    images.map(async (img, index) => {
      const result = await cloudinary.uploader.upload(img, {
        folder: "darpan-interiors/hero",
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
        order: index,
      };
    })
  );

  settings.heroImages = uploadedImages;
  await settings.save();
  res.json(settings);
});

module.exports = { getSettings, updateLogo, updateHeroImages };

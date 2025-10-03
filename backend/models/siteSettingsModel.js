const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    logo: {
      url: String,
      public_id: String,
    },
    heroImages: [
      {
        url: String,
        public_id: String,
        order: Number,
      },
    ],
    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);

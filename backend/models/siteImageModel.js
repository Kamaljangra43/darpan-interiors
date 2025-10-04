const mongoose = require("mongoose");

const siteImageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["hero", "logo", "about", "testimonial"],
    },
    section: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      public_id: String,
    },
    altText: String,
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    variant: {
      type: String,
      enum: ["light", "dark", ""],
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteImage", siteImageSchema);

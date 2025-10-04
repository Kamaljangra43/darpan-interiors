const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    details: String,
    client: String,
    year: String,
    duration: String,
    location: String,
    image: String, // Main thumbnail image
    images: [
      {
        url: String,
        featured: {
          type: Boolean,
          default: false, // NEW: Featured flag for slideshow
        },
        order: {
          type: Number,
          default: 0, // For custom ordering
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;

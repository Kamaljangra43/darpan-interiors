const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    description: { type: String, required: true },
    mission: String,
    vision: String,
    values: [String],
    featuredImage: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    category: { type: String, required: true }, // 'hero', 'about', 'services', 'general'
    section: String, // specific section within category
    alt_text: String,
    title: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);

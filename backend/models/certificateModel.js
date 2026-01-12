const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
    },
    issuingOrganization: {
      type: String,
      required: [true, "Issuing organization is required"],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
    },
    expiryDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    holderName: {
      type: String,
      default: "Darpan Interiors",
      trim: true,
    },
    category: {
      type: String,
      enum: ["company", "professional", "safety", "quality", "other"],
      default: "company",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
certificateSchema.index({ isActive: 1, displayOrder: 1 });
certificateSchema.index({ category: 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;

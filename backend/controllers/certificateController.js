const Certificate = require("../models/certificateModel");
const { deleteFromCloudinary } = require("../utils/imageUtils");

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res) => {
  try {
    const { category, isActive } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const certificates = await Certificate.find(filter).sort({
      displayOrder: 1,
      issueDate: -1,
    });

    res.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res
      .status(500)
      .json({ message: "Error fetching certificates", error: error.message });
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res
      .status(500)
      .json({ message: "Error fetching certificate", error: error.message });
  }
};

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private/Admin
const createCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);
    res.status(201).json(certificate);
  } catch (error) {
    console.error("Error creating certificate:", error);
    res
      .status(400)
      .json({ message: "Error creating certificate", error: error.message });
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private/Admin
const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // If updating image and old image exists, delete old image from cloudinary
    if (req.body.image && certificate.image && certificate.image.publicId) {
      if (req.body.image.publicId !== certificate.image.publicId) {
        await deleteFromCloudinary(certificate.image.publicId);
      }
    }

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCertificate);
  } catch (error) {
    console.error("Error updating certificate:", error);
    res
      .status(400)
      .json({ message: "Error updating certificate", error: error.message });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Delete image from cloudinary if exists
    if (certificate.image && certificate.image.publicId) {
      await deleteFromCloudinary(certificate.image.publicId);
    }

    await Certificate.findByIdAndDelete(req.params.id);

    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res
      .status(500)
      .json({ message: "Error deleting certificate", error: error.message });
  }
};

module.exports = {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};

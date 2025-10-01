const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  try {
    console.log("Request received:", {
      files: req.files,
      file: req.file,
      body: req.body,
    });

    if (!req.file) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    console.log("Processing file:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Create a promise to handle the file upload
    const uploadPromise = new Promise((resolve, reject) => {
      // Create a stream from the buffer
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      // Create upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "darpan-interiors",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Pipe the buffer stream to the upload stream
      bufferStream.pipe(uploadStream);
    });

    const uploadResponse = await uploadPromise;

    res.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Image upload failed");
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  try {
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Image deletion failed");
  }
});

module.exports = {
  uploadImage,
  deleteImage,
};

const asyncHandler = require("express-async-handler");
const Testimonial = require("../models/testimonialModel");
const cloudinary = require("../config/cloudinary");
const { optimizeImage } = require("../utils/imageUtils");

// @desc Get all testimonials
// @route GET /api/testimonials
// @access Public
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });

  // Optimize testimonial images (typically avatars/portraits)
  const optimizedTestimonials = testimonials.map((testimonial) => {
    const plain = testimonial.toObject ? testimonial.toObject() : testimonial;
    return {
      ...plain,
      image: optimizeImage(plain.image, 200, 200), // Small avatars
    };
  });

  res.json(optimizedTestimonials);
});

// @desc Create testimonial
// @route POST /api/testimonials
// @access Private
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, occupation, content, rating, image, projectType, featured } =
    req.body;

  // Handle image upload if provided
  let imageData = null;
  if (image && image.startsWith("data:")) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "darpan-interiors/testimonials",
      transformation: [
        {
          width: 400,
          height: 400,
          crop: "fill",
          gravity: "face", // Focus on face
          quality: "auto",
          fetch_format: "auto",
        },
        {
          radius: "max", // Make it circular
        },
      ],
    });
    imageData = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const testimonial = await Testimonial.create({
    name,
    occupation,
    content,
    rating: parseFloat(rating), // Convert to decimal
    image: imageData,
    projectType: projectType || "",
    featured: featured || false,
  });

  res.status(201).json(testimonial);
});

// @desc Update testimonial
// @route PUT /api/testimonials/:id
// @access Private
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (testimonial) {
    // Handle new image upload
    let imageData = testimonial.image;
    if (req.body.image && req.body.image.startsWith("data:")) {
      // Delete old image if exists
      if (testimonial.image?.public_id) {
        await cloudinary.uploader.destroy(testimonial.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "darpan-interiors/testimonials",
        transformation: [
          {
            width: 400,
            height: 400,
            crop: "fill",
            gravity: "face", // Focus on face
            quality: "auto",
            fetch_format: "auto",
          },
          {
            radius: "max", // Make it circular
          },
        ],
      });
      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    testimonial.name = req.body.name || testimonial.name;
    testimonial.occupation = req.body.occupation || testimonial.occupation;
    testimonial.content = req.body.content || testimonial.content;
    testimonial.rating =
      req.body.rating !== undefined
        ? parseFloat(req.body.rating)
        : testimonial.rating;
    testimonial.image = imageData;
    testimonial.projectType =
      req.body.projectType !== undefined
        ? req.body.projectType
        : testimonial.projectType;
    testimonial.featured =
      req.body.featured !== undefined
        ? req.body.featured
        : testimonial.featured;

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } else {
    res.status(404);
    throw new Error("Testimonial not found");
  }
});

// @desc Delete testimonial
// @route DELETE /api/testimonials/:id
// @access Private
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (testimonial) {
    // Delete image from Cloudinary if exists
    if (testimonial.image?.public_id) {
      await cloudinary.uploader.destroy(testimonial.image.public_id);
    }

    await testimonial.deleteOne();
    res.json({ message: "Testimonial removed" });
  } else {
    res.status(404);
    throw new Error("Testimonial not found");
  }
});

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};

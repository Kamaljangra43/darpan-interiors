const asyncHandler = require("express-async-handler");
const Testimonial = require("../models/testimonialModel");

// @desc Get all testimonials
// @route GET /api/testimonials
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  res.json(testimonials);
});

// @desc Create testimonial
// @route POST /api/testimonials
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, content, rating, image } = req.body;
  const testimonial = await Testimonial.create({
    name,
    content,
    rating,
    image,
  });
  res.status(201).json(testimonial);
});

// @desc Update testimonial
// @route PUT /api/testimonials/:id
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (testimonial) {
    testimonial.name = req.body.name || testimonial.name;
    testimonial.content = req.body.content || testimonial.content;
    testimonial.rating = req.body.rating || testimonial.rating;
    testimonial.image = req.body.image || testimonial.image;
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
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (testimonial) {
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

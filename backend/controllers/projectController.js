const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    images,
    details,
    client,
    year,
    location,
    duration,
    featured,
  } = req.body;

  // Process images with featured flags (default first 3 as featured)
  let processedImages = [];
  if (images && images.length > 0) {
    if (typeof images[0] === "string") {
      // Convert simple string array to object format
      processedImages = images.map((imageUrl, index) => ({
        url: imageUrl,
        featured: index < 3, // First 3 images are featured by default
        order: index,
      }));
    } else {
      // Already in object format, use as is
      processedImages = images;
    }
  }

  const project = await Project.create({
    title,
    description,
    category,
    details,
    client,
    year,
    location,
    duration,
    image: processedImages.length > 0 ? processedImages[0].url : undefined,
    images: processedImages,
    featured: featured || false,
  });

  res.status(201).json(project);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    // Handle image updates
    if (req.body.images) {
      // If it's a simple array, convert to object format
      if (
        req.body.images.length > 0 &&
        typeof req.body.images[0] === "string"
      ) {
        project.images = req.body.images.map((url, index) => ({
          url,
          featured: project.images[index]?.featured || index < 3,
          order: index,
        }));
      } else {
        // If it's already in object format, use as is
        project.images = req.body.images;
      }
    }

    // Update other fields
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.category = req.body.category || project.category;
    project.details =
      req.body.details !== undefined ? req.body.details : project.details;
    project.client =
      req.body.client !== undefined ? req.body.client : project.client;
    project.year = req.body.year !== undefined ? req.body.year : project.year;
    project.location =
      req.body.location !== undefined ? req.body.location : project.location;
    project.duration =
      req.body.duration !== undefined ? req.body.duration : project.duration;
    project.featured =
      req.body.featured !== undefined ? req.body.featured : project.featured;

    // Update main image
    if (project.images.length > 0) {
      project.image = project.images[0].url || project.images[0];
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: "Project removed" });
  } else {
    res.status(404);
    throw new Error("Project not found");
  }
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

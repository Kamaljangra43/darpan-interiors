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
  const { title, description, category, images, featured } = req.body;

  const project = await Project.create({
    title,
    description,
    category,
    images,
    featured: featured || false,
  });

  res.status(201).json(project);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
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

  const project = await Project.findById(req.params.id);

  if (project) {
    // Update all fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.images = images || project.images;
    project.details = details !== undefined ? details : project.details;
    project.client = client !== undefined ? client : project.client;
    project.year = year !== undefined ? year : project.year;
    project.location = location !== undefined ? location : project.location;
    project.duration = duration !== undefined ? duration : project.duration;
    project.featured = featured !== undefined ? featured : project.featured;

    // Update main image if images array changed
    if (images && images.length > 0) {
      project.image = images[0];
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

const asyncHandler = require("express-async-handler");
const Service = require("../models/serviceModel");

const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({}).sort({ order: 1 });
  res.json(services);
});

const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(service);
});

const deleteService = asyncHandler(async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted" });
});

module.exports = { getServices, createService, updateService, deleteService };

const asyncHandler = require("express-async-handler");
const Stats = require("../models/statsModel");

const getStats = asyncHandler(async (req, res) => {
  const stats = await Stats.find({}).sort({ order: 1 });
  res.json(stats);
});

const createStat = asyncHandler(async (req, res) => {
  const stat = await Stats.create(req.body);
  res.status(201).json(stat);
});

const updateStat = asyncHandler(async (req, res) => {
  const stat = await Stats.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(stat);
});

const deleteStat = asyncHandler(async (req, res) => {
  await Stats.findByIdAndDelete(req.params.id);
  res.json({ message: "Stat deleted" });
});

module.exports = { getStats, createStat, updateStat, deleteStat };

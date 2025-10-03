const asyncHandler = require("express-async-handler");
const About = require("../models/aboutModel");

const getAbout = asyncHandler(async (req, res) => {
  const about = await About.findOne();
  res.json(about || {});
});

const updateAbout = asyncHandler(async (req, res) => {
  let about = await About.findOne();
  if (about) {
    Object.assign(about, req.body);
    await about.save();
  } else {
    about = await About.create(req.body);
  }
  res.json(about);
});

module.exports = { getAbout, updateAbout };

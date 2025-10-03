const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  // User is attached to req.user by passport
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      token: generateToken(req.user._id),
    });
  } else {
    res.status(401);
    throw new Error("Google authentication failed");
  }
});

module.exports = {
  loginUser,
  getUserProfile,
  googleAuth,
};

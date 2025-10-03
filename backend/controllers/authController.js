const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// @desc Auth user & get token
// @route POST /api/auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Verify if user is admin by email
// @route POST /api/auth/verify-admin
// @access Public
const verifyAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log("Verifying admin access for:", email);

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  // Check if user exists and is admin
  let user = await User.findOne({ email });

  if (!user) {
    // Create user if doesn't exist (first time Google login)
    console.log("User not found, creating new user:", email);
    user = await User.create({
      email,
      name: req.body.name || email.split("@")[0],
      isAdmin: false, // Default to non-admin
    });
  }

  if (user.isAdmin) {
    console.log("Admin verified successfully:", email);
    res.json({
      isAdmin: true,
      _id: user._id,
      email: user.email,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    console.log("User is not admin:", email);
    res.status(403);
    throw new Error("User is not authorized as admin");
  }
});

module.exports = {
  loginUser,
  getUserProfile,
  verifyAdmin,
};

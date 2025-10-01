const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/darpan-interiors"
    );

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      username: "admin@darpaninteriors.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      username: "admin@darpaninteriors.com",
      password: "admin123", // This will be hashed by the pre-save middleware
    });

    console.log("Admin user created successfully:", admin.username);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();

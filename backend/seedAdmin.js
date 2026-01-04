const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel");

// Load environment variables
dotenv.config();

console.log("🔍 Checking environment variables...");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGODB_URI length:", process.env.MONGODB_URI?.length || 0);

if (!process.env.MONGODB_URI) {
  console.error("\n❌ ERROR: MONGODB_URI is not defined in .env file!");
  console.error("Please create a .env file in the backend directory with:");
  console.error("MONGODB_URI=your-mongodb-connection-string");
  process.exit(1);
}

const createAdmin = async () => {
  try {
    console.log("\n🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!\n");

    // Admin emails to create
    const adminEmails = [
      "kamalsinghjangra106@gmail.com",
      "darpaninteriors1@gmail.com",
    ];

    for (const adminEmail of adminEmails) {
      console.log(`\n🔍 Looking for user: ${adminEmail}`);

      const existingAdmin = await User.findOne({ email: adminEmail });

      if (existingAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log("✅ Admin user updated:", adminEmail);
        console.log("   User ID:", existingAdmin._id);
        console.log("   Is Admin:", existingAdmin.isAdmin);
      } else {
        const name = adminEmail.includes("kamalsingh")
          ? "Kamal Jangra"
          : "Darpan Admin";
        const newAdmin = await User.create({
          name: name,
          email: adminEmail,
          isAdmin: true,
        });
        console.log("✅ Admin user created:", adminEmail);
        console.log("   User ID:", newAdmin._id);
        console.log("   Is Admin:", newAdmin.isAdmin);
      }

      // Verify
      const verifyUser = await User.findOne({ email: adminEmail });
      console.log("\n🔍 Verification:");
      console.log("   Email:", verifyUser.email);
      console.log("   Name:", verifyUser.name);
      console.log("   Is Admin:", verifyUser.isAdmin);
    }

    console.log("\n🎉 Success! All admin accounts configured!");

    await mongoose.connection.close();
    console.log("📪 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
};

createAdmin();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Certificate = require("./models/certificateModel");

dotenv.config();

async function clearCertificates() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/darpan-interiors"
    );
    console.log("Connected to MongoDB");

    const result = await Certificate.deleteMany({});
    console.log(`Deleted ${result.deletedCount} certificates`);

    const remaining = await Certificate.find({});
    console.log(`Remaining certificates: ${remaining.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

clearCertificates();

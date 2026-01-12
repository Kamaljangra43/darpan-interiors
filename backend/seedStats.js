const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Stats = require("./models/statsModel");

dotenv.config();

const statsData = [
  {
    label: "Established",
    value: "2017",
    icon: "Award",
    order: 1,
  },
  {
    label: "Years Experience",
    value: "21+",
    icon: "TrendingUp",
    order: 2,
  },
  {
    label: "Coverage",
    value: "Pan India",
    icon: "MapPin",
    order: 3,
  },
  {
    label: "Team Members",
    value: "135+",
    icon: "Users",
    order: 4,
  },
];

const seedStats = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/darpan-interiors"
    );
    console.log("Connected to MongoDB");

    // Check if stats already exist
    const existingStats = await Stats.find();
    if (existingStats.length > 0) {
      console.log("Stats already exist. Skipping seed...");
      console.log(`Found ${existingStats.length} stats in database`);
      process.exit(0);
    }

    // Insert stats
    await Stats.insertMany(statsData);
    console.log("✅ Stats seeded successfully!");
    console.log("Seeded stats:");
    statsData.forEach((stat) => {
      console.log(`  - ${stat.label}: ${stat.value}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding stats:", error);
    process.exit(1);
  }
};

seedStats();

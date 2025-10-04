const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const imageRoutes = require("./routes/imageRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const statsRoutes = require("./routes/statsRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/darpan-interiors"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/site-images", require("./routes/siteImageRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Darpan Interiors API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

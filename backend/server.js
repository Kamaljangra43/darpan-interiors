const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Added a limit for JSON body size, useful for image uploads
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Health check route
app.get("/", (req, res) => res.send("Backend server is running!"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 3010;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
  )
  .catch((err) => console.error("❌ MongoDB connection error:", err));

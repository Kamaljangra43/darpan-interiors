require('dotenv').config();
const cloudinary = require("./config/cloudinary");
const { optimizeImage } = require("./utils/imageUtils");

const testUrl = "https://res.cloudinary.com/dyrivmkfv/image/upload/v1767545819/darpan-interiors/projects/gsxz3cplapp2aqqvgif5.jpg";

console.log("=== TESTING IMAGE OPTIMIZATION ===\n");
console.log("Original URL:", testUrl);

// Test as string
const optimized1 = optimizeImage(testUrl, 1200, 675);
console.log("\nOptimized (string):", optimized1);

// Test as object
const testObj = { url: testUrl, featured: true };
const optimized2 = optimizeImage(testObj, 1200, 675);
console.log("\nOptimized (object):", JSON.stringify(optimized2, null, 2));


const cloudinary = require("cloudinary").v2;

// Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  if (!url || typeof url !== "string") return null;

  // Match Cloudinary URL pattern
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : null;
};

// Generate optimized Cloudinary URL from existing URL or public ID
const getOptimizedImageUrl = (urlOrPublicId, width = 1200, height = 675) => {
  if (!urlOrPublicId) return null;

  // If it's already a full URL, extract public ID
  let publicId = urlOrPublicId;
  if (urlOrPublicId.includes("cloudinary.com")) {
    publicId = extractPublicId(urlOrPublicId);
    if (!publicId) return urlOrPublicId; // Return original if can't parse
  }

  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto:eco",
    width: width,
    height: height,
    crop: "fill",
    gravity: "auto",
    dpr: "auto",
  });
};

// Generate responsive image URLs
const getResponsiveImageUrls = (
  urlOrPublicId,
  baseWidth = 1200,
  baseHeight = 675
) => {
  const aspectRatio = baseHeight / baseWidth;

  const sizes = [
    { width: 400, height: Math.round(400 * aspectRatio) },
    { width: 800, height: Math.round(800 * aspectRatio) },
    { width: 1200, height: Math.round(1200 * aspectRatio) },
  ];

  return sizes.map((size) => ({
    width: size.width,
    url: getOptimizedImageUrl(urlOrPublicId, size.width, size.height),
  }));
};

// Optimize image object (handles both string URLs and objects with url property)
const optimizeImage = (image, width = 800, height = 600) => {
  if (!image) return null;

  if (typeof image === "string") {
    return getOptimizedImageUrl(image, width, height);
  }

  if (typeof image === "object" && image.url) {
    return {
      ...image,
      url: getOptimizedImageUrl(image.url, width, height),
    };
  }

  return image;
};

// Format project with optimized images
const formatProjectWithImages = (project) => {
  const plainProject = project.toObject ? project.toObject() : project;

  // Optimize images array
  if (plainProject.images && Array.isArray(plainProject.images)) {
    plainProject.images = plainProject.images.map((img) =>
      optimizeImage(img, 800, 600)
    );
  }

  return plainProject;
};

module.exports = {
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  formatProjectWithImages,
  optimizeImage,
  extractPublicId,
};

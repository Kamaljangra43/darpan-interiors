import apiClient from "../api";

export const imageService = {
  // Upload image to Cloudinary via backend
  uploadImage: async (imageData) => {
    const response = await apiClient.post("/images/upload", imageData);
    return response.data;
  },

  // Get images by category
  getImagesByCategory: async (category) => {
    const response = await apiClient.get(`/images/${category}`);
    return response.data;
  },

  // Delete image
  deleteImage: async (id) => {
    const response = await apiClient.delete(`/images/${id}`);
    return response.data;
  },
};

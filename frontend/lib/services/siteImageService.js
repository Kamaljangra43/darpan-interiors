import apiClient from "../api";

export const siteImageService = {
  getAllSiteImages: async (category, section) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (section) params.append("section", section);

    const response = await apiClient.get(`/site-images?${params}`);
    return response.data;
  },

  createSiteImage: async (imageData) => {
    const response = await apiClient.post("/site-images", imageData);
    return response.data;
  },

  updateSiteImage: async (id, imageData) => {
    const response = await apiClient.put(`/site-images/${id}`, imageData);
    return response.data;
  },

  deleteSiteImage: async (id) => {
    const response = await apiClient.delete(`/site-images/${id}`);
    return response.data;
  },
};

import apiClient from "../api";

export const siteSettingsService = {
  getSettings: async () => {
    const response = await apiClient.get("/site-settings");
    return response.data;
  },

  updateLogo: async (imageData) => {
    const response = await apiClient.put("/site-settings/logo", imageData);
    return response.data;
  },

  updateHeroImages: async (imagesData) => {
    const response = await apiClient.put(
      "/site-settings/hero-images",
      imagesData
    );
    return response.data;
  },
};

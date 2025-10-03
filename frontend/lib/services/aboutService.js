import apiClient from "../api";

export const aboutService = {
  getAbout: async () => {
    const response = await apiClient.get("/about");
    return response.data;
  },

  updateAbout: async (aboutData) => {
    const response = await apiClient.put("/about", aboutData);
    return response.data;
  },
};

import apiClient from "../api";

export const statsService = {
  getAllStats: async () => {
    const response = await apiClient.get("/stats");
    return response.data;
  },

  createStat: async (statData) => {
    const response = await apiClient.post("/stats", statData);
    return response.data;
  },

  updateStat: async (id, statData) => {
    const response = await apiClient.put(`/stats/${id}`, statData);
    return response.data;
  },

  deleteStat: async (id) => {
    const response = await apiClient.delete(`/stats/${id}`);
    return response.data;
  },
};

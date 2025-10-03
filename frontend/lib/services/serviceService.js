import apiClient from "../api";

export const serviceService = {
  getAllServices: async () => {
    const response = await apiClient.get("/services");
    return response.data;
  },

  createService: async (serviceData) => {
    const response = await apiClient.post("/services", serviceData);
    return response.data;
  },

  updateService: async (id, serviceData) => {
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },
};

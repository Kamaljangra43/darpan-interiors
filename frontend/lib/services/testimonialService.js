import apiClient from "../api";

export const testimonialService = {
  getAllTestimonials: async () => {
    const response = await apiClient.get("/testimonials");
    return response.data;
  },

  createTestimonial: async (testimonialData) => {
    const response = await apiClient.post("/testimonials", testimonialData);
    return response.data;
  },

  updateTestimonial: async (id, testimonialData) => {
    const response = await apiClient.put(
      `/testimonials/${id}`,
      testimonialData
    );
    return response.data;
  },

  deleteTestimonial: async (id) => {
    const response = await apiClient.delete(`/testimonials/${id}`);
    return response.data;
  },
};

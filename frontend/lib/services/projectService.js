import apiClient from "../api";

export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    const response = await apiClient.get("/projects");
    return response.data;
  },

  // Get single project
  getProjectById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  // Create project
  createProject: async (projectData) => {
    const response = await apiClient.post("/projects", projectData);
    return response.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};

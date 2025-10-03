"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { projectService } from "@/lib/services/projectService";
import { imageService } from "@/lib/services/imageService";
import type { Project } from "@/types/project";

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "_id" | "id">) => Promise<void>;
  updateProject: (
    id: string,
    updatedProject: Partial<Project>
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();

      // Normalize image format to string array
      const normalizedProjects = data.map((project: any) => ({
        ...project,
        images:
          project.images?.map((img: any) =>
            typeof img === "string" ? img : img.url
          ) || [],
      }));

      setProjects(normalizedProjects);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, "_id" | "id">) => {
    try {
      setLoading(true);

      // Upload images to Cloudinary via backend
      const uploadedImages = await Promise.all(
        project.images.map(async (imageBase64) => {
          const result = await imageService.uploadImage({
            image: imageBase64,
            category: "projects",
            section: project.category,
          });
          return result.url;
        })
      );

      // Create project with Cloudinary URLs as strings
      const projectData = {
        ...project,
        image: uploadedImages[0] || project.image,
        images: uploadedImages,
      };

      const newProject = await projectService.createProject(projectData);

      // Normalize the response
      const normalizedProject = {
        ...newProject,
        images:
          newProject.images?.map((img: any) =>
            typeof img === "string" ? img : img.url
          ) || [],
      };

      setProjects((prev) => [normalizedProject, ...prev]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to add project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (
    id: string,
    updatedProject: Partial<Project>
  ) => {
    try {
      setLoading(true);
      const updated = await projectService.updateProject(id, updatedProject);

      // Normalize the response
      const normalizedProject = {
        ...updated,
        images:
          updated.images?.map((img: any) =>
            typeof img === "string" ? img : img.url
          ) || [],
      };

      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? normalizedProject : p))
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        loading,
        error,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
}

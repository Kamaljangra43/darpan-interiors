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

      // Optimize Cloudinary URLs
      const optimizeCloudinaryUrl = (url: string) => {
        if (url && url.includes('cloudinary.com')) {
          return url.replace('/upload/', '/upload/f_auto,q_auto,w_800,h_600,c_fill/');
        }
        return url;
      };

      // Normalize projects to handle both old and new image formats
      const normalizedProjects = data.map((project: any) => {
        // If images is already in the new format (array of objects)
        if (
          project.images &&
          project.images.length > 0 &&
          typeof project.images[0] === "object"
        ) {
          // Images are already in the correct format - optimize URLs
          return {
            ...project,
            images: project.images.map((img: any) => ({
              ...img,
              url: optimizeCloudinaryUrl(img.url || img),
            })),
          };
        }
        // If images is in old format (array of strings)
        else if (project.images && project.images.length > 0) {
          // Convert to new format with optimized URLs
          return {
            ...project,
            images: project.images.map((url: string, index: number) => ({
              url: optimizeCloudinaryUrl(url),
              featured: index < 3, // First 3 as featured by default
              order: index,
            })),
          };
        }

        return project;
      });

      console.log("✅ Projects normalized:", normalizedProjects);
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

      // Extract image URLs (handling both string and object formats during upload)
      const imageUrls = project.images.map((img: any) =>
        typeof img === "string" ? img : img.url
      );

      // Upload images to Cloudinary via backend if they're base64
      const uploadedImages = await Promise.all(
        imageUrls.map(async (imageUrl: string) => {
          if (imageUrl.startsWith("data:")) {
            const result = await imageService.uploadImage({
              image: imageUrl,
              category: "projects",
              section: project.category,
            });
            return result.url;
          }
          return imageUrl;
        })
      );

      // Create processed images array with featured flags
      const processedImages = uploadedImages.map((url, index) => ({
        url,
        featured: index < 3, // First 3 as featured by default
        order: index,
      }));

      // Create project with processed images
      const projectData = {
        ...project,
        image: uploadedImages[0] || project.image,
        images: processedImages,
      };

      const newProject = await projectService.createProject(projectData);

      setProjects((prev) => [newProject, ...prev]);
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

      let processedImages = updatedProject.images || [];

      // If there are images to update
      if (updatedProject.images && updatedProject.images.length > 0) {
        // Extract URLs and check for base64
        const imageUrls = updatedProject.images.map((img) => img.url);
        const hasBase64 = imageUrls.some((url) => url.startsWith("data:"));

        if (hasBase64) {
          // Upload new base64 images to Cloudinary
          const uploadedUrls = await Promise.all(
            imageUrls.map(async (url) => {
              if (url.startsWith("data:")) {
                const result = await imageService.uploadImage({
                  image: url,
                  category: "projects",
                  section: updatedProject.category || "project",
                });
                return result.url;
              }
              return url;
            })
          );

          // Recreate images array with uploaded URLs
          processedImages = updatedProject.images.map((img, index) => ({
            url: uploadedUrls[index],
            featured: img.featured ?? index < 3,
            order: img.order ?? index,
          }));
        }
      }

      // Prepare update data with ALL fields
      const updateData = {
        title: updatedProject.title,
        category: updatedProject.category,
        description: updatedProject.description,
        details: updatedProject.details || "",
        client: updatedProject.client || "",
        year: updatedProject.year || "",
        location: updatedProject.location || "",
        duration: updatedProject.duration || "",
        image:
          processedImages.length > 0
            ? processedImages[0].url
            : updatedProject.image,
        images: processedImages,
        featured: updatedProject.featured,
      };

      const updated = await projectService.updateProject(id, updateData);

      setProjects((prev) =>
        prev.map((p) => (p._id === id || p.id === id ? updated : p))
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

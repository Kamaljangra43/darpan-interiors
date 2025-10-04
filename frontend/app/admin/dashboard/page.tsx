"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/projects-context";
import { useTestimonials } from "@/contexts/testimonials-context";
import { useSiteImages } from "@/contexts/site-images-context";
import { useStats } from "@/contexts/stats-context";
import {
  Trash2,
  Plus,
  X,
  Edit,
  LogOut,
  Upload,
  Home,
  Users,
  Briefcase,
  Image as ImageIcon,
  Info,
  Wrench,
  BarChart3,
  Star,
  Settings,
  Save,
} from "lucide-react";
import type { Project, Testimonial } from "@/types/project";
import apiClient from "@/lib/api";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    loading: projectsLoading,
  } = useProjects();
  const { testimonials, addTestimonial, deleteTestimonial } = useTestimonials();
  const { siteImages, getSiteImagesByCategory, addSiteImage, deleteSiteImage } =
    useSiteImages();
  const { stats, updateStat, loading: statsLoading } = useStats();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [isUploading, setIsUploading] = useState(false);

  // Project states
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Residential",
    client: "",
    year: new Date().getFullYear().toString(),
    location: "",
    description: "",
    details: "",
    images: [] as string[],
  });
  const [editProjectData, setEditProjectData] = useState({
    title: "",
    category: "Residential",
    client: "",
    year: "",
    location: "",
    description: "",
    details: "",
    images: [] as string[],
  });

  // Enhanced state for managing featured images
  const [editProjectImages, setEditProjectImages] = useState<
    Array<{
      url: string;
      featured: boolean;
      order: number;
    }>
  >([]);

  // State for managing featured images in Add Project form
  const [newProjectImages, setNewProjectImages] = useState<
    Array<{
      url: string;
      featured: boolean;
      order: number;
    }>
  >([]);

  // Testimonial states
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  // Fix the initial state - ensure rating is always a number
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    occupation: "",
    projectType: "",
    content: "",
    rating: 5.0, // Make sure it's a number, not undefined
    image: "",
  });

  // Stats states
  const [editingStat, setEditingStat] = useState<string | null>(null);
  const [editStatValue, setEditStatValue] = useState({ label: "", value: "" });

  // Services state
  // Image management states
  const [imageSection, setImageSection] = useState("hero");
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [logoImage, setLogoImage] = useState("");

  // Site images states
  const [activeImageCategory, setActiveImageCategory] = useState("hero");
  const [showAddImage, setShowAddImage] = useState(false);
  const [newSiteImage, setNewSiteImage] = useState({
    category: "hero",
    section: "main",
    title: "",
    image: "",
    altText: "",
    order: 0,
    variant: "", // for logo: 'light' or 'dark'
  });

  // Loading state for project operations
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Helper function to toggle featured status
  const toggleFeaturedImage = (index: number, featured: boolean) => {
    setEditProjectImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, featured } : img))
    );
  };

  // Helper function to move image up
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setEditProjectImages((prev) => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      return newImages.map((img, i) => ({ ...img, order: i }));
    });
    setEditProjectData((prev) => {
      const newImageUrls = [...prev.images];
      [newImageUrls[index - 1], newImageUrls[index]] = [
        newImageUrls[index],
        newImageUrls[index - 1],
      ];
      return { ...prev, images: newImageUrls };
    });
  };

  // Helper function to move image down
  const moveImageDown = (index: number) => {
    if (index === editProjectImages.length - 1) return;
    setEditProjectImages((prev) => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      return newImages.map((img, i) => ({ ...img, order: i }));
    });
    setEditProjectData((prev) => {
      const newImageUrls = [...prev.images];
      [newImageUrls[index], newImageUrls[index + 1]] = [
        newImageUrls[index],
        newImageUrls[index + 1],
      ];
      return { ...prev, images: newImageUrls };
    });
  };

  // Helper function to remove image
  const removeImage = (index: number) => {
    setEditProjectImages((prev) =>
      prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }))
    );
    setEditProjectData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Helper functions for Add Project form
  const toggleNewProjectFeatured = (index: number, featured: boolean) => {
    setNewProjectImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, featured } : img))
    );
  };

  const moveNewProjectImageUp = (index: number) => {
    if (index === 0) return;
    setNewProjectImages((prev) => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      return newImages.map((img, i) => ({ ...img, order: i }));
    });
    setNewProject((prev) => {
      const newImageUrls = [...prev.images];
      [newImageUrls[index - 1], newImageUrls[index]] = [
        newImageUrls[index],
        newImageUrls[index - 1],
      ];
      return { ...prev, images: newImageUrls };
    });
  };

  const moveNewProjectImageDown = (index: number) => {
    if (index === newProjectImages.length - 1) return;
    setNewProjectImages((prev) => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      return newImages.map((img, i) => ({ ...img, order: i }));
    });
    setNewProject((prev) => {
      const newImageUrls = [...prev.images];
      [newImageUrls[index], newImageUrls[index + 1]] = [
        newImageUrls[index + 1],
        newImageUrls[index],
      ];
      return { ...prev, images: newImageUrls };
    });
  };

  const removeNewProjectImage = (index: number) => {
    setNewProjectImages((prev) =>
      prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }))
    );
    setNewProject((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Verify admin access
  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await apiClient.post("/auth/verify-admin", {
            email: session.user.email,
            name: session.user.name,
          });

          if (response.data.isAdmin) {
            setIsAdmin(true);
            localStorage.setItem("token", response.data.token);
          } else {
            router.push("/admin/error?error=AccessDenied");
          }
        } catch (error) {
          console.error("Admin verification failed:", error);
          router.push("/admin/error?error=AccessDenied");
        } finally {
          setIsVerifying(false);
        }
      } else if (status === "unauthenticated") {
        router.push("/admin/login");
      }
    };

    verifyAdminAccess();
  }, [status, session, router]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (images: string[]) => void
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imagePromises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
            if (readerEvent.target?.result) {
              resolve(readerEvent.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(callback);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !newProject.title ||
      !newProject.category ||
      newProject.images.length === 0
    ) {
      alert("Please fill in all required fields including at least one image.");
      return;
    }

    setIsSavingProject(true);
    try {
      // Convert newProjectImages to the format expected by the API
      const imagesWithMetadata = newProjectImages.map((img) => ({
        url: img.url,
        featured: img.featured,
        order: img.order,
      }));

      const projectData = {
        ...newProject,
        images: imagesWithMetadata,
      };

      await addProject(projectData as any);
      setNewProject({
        title: "",
        category: "Residential",
        client: "",
        year: new Date().getFullYear().toString(),
        location: "",
        description: "",
        details: "",
        images: [],
      });
      setNewProjectImages([]);
      setShowAddProject(false);
      alert("Project added successfully!");
    } catch (error: any) {
      console.error("Error adding project:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      alert(
        `Failed to add project: ${errorMessage}\n\nPlease check your internet connection and try again.`
      );
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);

    // Extract image URLs for legacy compatibility
    const imageUrls =
      project.images?.map((img: any) =>
        typeof img === "object" ? img.url : img
      ) || [];

    setEditProjectData({
      title: project.title,
      category: project.category,
      client: project.client || "",
      year: project.year || "",
      location: project.location || "",
      description: project.description || "",
      details: project.details || "",
      images: imageUrls,
    });

    // Convert project images to enhanced format for featured management
    if (project.images && project.images.length > 0) {
      const processedImages = project.images.map((img: any, index: number) => {
        if (typeof img === "object" && img.url) {
          return {
            url: img.url,
            featured: img.featured ?? index < 3,
            order: img.order ?? index,
          };
        }
        return {
          url: typeof img === "string" ? img : "",
          featured: index < 3,
          order: index,
        };
      });
      setEditProjectImages(processedImages);
    } else {
      setEditProjectImages([]);
    }

    setShowEditProject(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?._id) return;

    // Validation
    if (
      !editProjectData.title ||
      !editProjectData.category ||
      editProjectImages.length === 0
    ) {
      alert("Please fill in all required fields including at least one image.");
      return;
    }

    setIsSavingProject(true);
    try {
      const updateData = {
        ...editProjectData,
        images: editProjectImages, // Send the full image objects with featured flags
      };

      console.log("🔄 Updating project with images:", updateData);

      await updateProject(editingProject._id, updateData);
      setShowEditProject(false);
      setEditingProject(null);
      setEditProjectData({
        title: "",
        category: "Residential",
        client: "",
        year: "",
        location: "",
        description: "",
        details: "",
        images: [],
      });
      setEditProjectImages([]);
      alert("Project updated successfully!");
    } catch (error: any) {
      console.error("Error updating project:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      alert(
        `Failed to update project: ${errorMessage}\n\nPlease check your internet connection and try again.`
      );
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setNewProject({
      title: "",
      category: "Residential",
      client: "",
      year: new Date().getFullYear().toString(),
      location: "",
      description: "",
      details: "",
      images: [],
    });
    setShowAddProject(false);
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("📤 Submitting testimonial:", newTestimonial);
      await addTestimonial(newTestimonial as any);
      console.log("✅ Testimonial submitted successfully!");
      setNewTestimonial({
        name: "",
        occupation: "",
        projectType: "",
        content: "",
        rating: 5,
        image: "",
      });
      setShowAddTestimonial(false);
      alert("Testimonial added successfully!");
    } catch (error) {
      console.error("❌ Error adding testimonial:", error);
      alert("Failed to add testimonial. Check console for details.");
    }
  };

  const handleTestimonialImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewTestimonial((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditStat = (stat: any) => {
    setEditingStat(stat._id);
    setEditStatValue({ label: stat.label, value: stat.value });
  };

  const handleSaveStat = async () => {
    if (!editingStat) return;
    try {
      await updateStat(editingStat, editStatValue);
      setEditingStat(null);
    } catch (error) {
      console.error("Failed to update stat:", error);
      alert("Failed to update stat. Please try again.");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, async (images) => {
      setLogoImage(images[0]);
      alert("Logo updated successfully!");
    });
  };

  const handleHeroImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleImageUpload(e, async (images) => {
      setHeroImages([...heroImages, ...images]);
      alert("Hero images added successfully!");
    });
  };

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    await signOut({ callbackUrl: "/" });
  };

  const handleAddSiteImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return; // Prevent duplicate submissions

    setIsUploading(true);
    try {
      // Ensure category matches the active category
      const imageData = {
        ...newSiteImage,
        category: activeImageCategory,
      };
      await addSiteImage(imageData as any);
      setNewSiteImage({
        category: activeImageCategory,
        section: "main",
        title: "",
        image: "",
        altText: "",
        order: 0,
        variant: "",
      });
      setShowAddImage(false);
    } catch (error) {
      console.error("Error adding site image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSiteImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewSiteImage((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === "loading" || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.open("/", "_blank")}
                variant="outline"
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b">
          <TabButton
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            icon={<Briefcase className="w-4 h-4" />}
          >
            Projects
          </TabButton>
          <TabButton
            active={activeTab === "testimonials"}
            onClick={() => setActiveTab("testimonials")}
            icon={<Users className="w-4 h-4" />}
          >
            Testimonials
          </TabButton>
          <TabButton
            active={activeTab === "images"}
            onClick={() => setActiveTab("images")}
            icon={<ImageIcon className="w-4 h-4" />}
          >
            Images
          </TabButton>
          <TabButton
            active={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
            icon={<BarChart3 className="w-4 h-4" />}
          >
            Stats
          </TabButton>
          <TabButton
            active={activeTab === "services"}
            onClick={() => setActiveTab("services")}
            icon={<Wrench className="w-4 h-4" />}
          >
            Services
          </TabButton>
        </div>

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Projects
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Add, edit, and manage your portfolio projects
                </p>
              </div>
              <Button
                onClick={() => setShowAddProject(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            {projectsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  No projects yet. Add your first project!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onDelete={(id: string) => {
                      if (confirm("Delete this project?")) {
                        deleteProject(id);
                      }
                    }}
                    onEdit={handleEditProject}
                  />
                ))}
              </div>
            )}

            {/* Edit Project Modal */}
            {showEditProject && editingProject && (
              <Modal
                onClose={() => {
                  setShowEditProject(false);
                  setEditingProject(null);
                }}
                title="Edit Project"
              >
                <form onSubmit={handleUpdateProject} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Project Title *"
                      value={editProjectData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditProjectData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g., Luxury Living Room"
                      required
                    />
                    <Select
                      label="Category *"
                      value={editProjectData.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setEditProjectData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      options={["Residential", "Commercial"]}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Client"
                      value={editProjectData.client}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditProjectData((prev) => ({
                          ...prev,
                          client: e.target.value,
                        }))
                      }
                      placeholder="Client name"
                    />
                    <Input
                      label="Year"
                      value={editProjectData.year}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditProjectData((prev) => ({
                          ...prev,
                          year: e.target.value,
                        }))
                      }
                      placeholder="2024"
                    />
                    <Input
                      label="Location"
                      value={editProjectData.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditProjectData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="City, State"
                    />
                  </div>

                  <TextArea
                    label="Description"
                    value={editProjectData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditProjectData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description"
                    rows={2}
                  />

                  <TextArea
                    label="Detailed Description"
                    value={editProjectData.details}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditProjectData((prev) => ({
                        ...prev,
                        details: e.target.value,
                      }))
                    }
                    placeholder="Detailed information..."
                    rows={4}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project Images *{" "}
                      <span className="text-gray-500 text-xs">
                        (First will be main thumbnail)
                      </span>
                    </label>

                    {/* Featured Images Summary */}
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">
                          {
                            editProjectImages.filter((img) => img.featured)
                              .length
                          }{" "}
                          images selected for featured slideshow
                        </span>
                      </div>
                      {editProjectImages.filter((img) => img.featured)
                        .length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠️ No featured images selected. First 5 will be shown
                          by default.
                        </p>
                      )}
                    </div>

                    {/* Image Grid */}
                    {editProjectImages.length > 0 && (
                      <div className="mb-3 grid grid-cols-4 gap-3">
                        {editProjectImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
                          >
                            <Image
                              src={img.url}
                              alt={`Preview ${idx + 1}`}
                              fill
                              className="object-cover"
                            />

                            {/* Order Badge */}
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                              #{idx + 1}
                            </div>

                            {/* Main Thumbnail Badge */}
                            {idx === 0 && (
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                                MAIN
                              </div>
                            )}

                            {/* Featured Badge */}
                            {img.featured && (
                              <div className="absolute bottom-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md flex items-center gap-1">
                                <Star className="w-3 h-3 fill-white" />
                                Featured
                              </div>
                            )}

                            {/* Control Buttons */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
                              {/* Move Up Button */}
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    moveImageUp(idx);
                                  }}
                                  className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors shadow-md"
                                  title="Move up"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                </button>
                              )}
                              {/* Move Down Button */}
                              {idx < editProjectImages.length - 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    moveImageDown(idx);
                                  }}
                                  className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors shadow-md"
                                  title="Move down"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              )}
                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeImage(idx);
                                }}
                                className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition-colors shadow-md"
                                title="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Featured Checkbox Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
                              <div className="absolute bottom-2 right-2 flex items-center gap-2 pointer-events-auto">
                                <label className="flex items-center gap-1.5 bg-white/95 dark:bg-gray-800/95 px-2 py-1.5 rounded shadow-lg cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={img.featured}
                                    onChange={(e) =>
                                      toggleFeaturedImage(idx, e.target.checked)
                                    }
                                    className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                                  />
                                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                                    Featured
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Images Button */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleImageUpload(e, (newImageUrls) => {
                          const currentFeaturedCount = editProjectImages.filter(
                            (img) => img.featured
                          ).length;

                          // Create new image objects with featured flags
                          const newImages = newImageUrls.map((url, index) => ({
                            url,
                            featured: currentFeaturedCount === 0 && index < 3, // Auto-feature first 3 if none selected
                            order: editProjectImages.length + index,
                          }));

                          // Update both states
                          setEditProjectImages((prev) => [
                            ...prev,
                            ...newImages,
                          ]);
                          setEditProjectData((prev) => ({
                            ...prev,
                            images: [...prev.images, ...newImageUrls],
                          }));
                        })
                      }
                      className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-sm hover:border-amber-500 dark:hover:border-amber-500 transition-colors cursor-pointer"
                      id="edit-project-images"
                    />
                    <label
                      htmlFor="edit-project-images"
                      className="block mt-2 text-xs text-gray-500 dark:text-gray-400 text-center cursor-pointer"
                    >
                      Click to add more images • First 3 new images will be
                      featured if none selected
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowEditProject(false);
                        setEditingProject(null);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 flex-1"
                      disabled={
                        isSavingProject ||
                        !editProjectData.title ||
                        editProjectData.images.length === 0
                      }
                    >
                      {isSavingProject ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Modal>
            )}

            {showAddProject && (
              <Modal
                onClose={handleCancelEdit}
                title={editingProject ? "Edit Project" : "Add New Project"}
              >
                <form
                  onSubmit={
                    editingProject ? handleUpdateProject : handleAddProject
                  }
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Project Title *"
                      value={newProject.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewProject((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g., Luxury Living Room"
                      required
                    />
                    <Select
                      label="Category *"
                      value={newProject.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewProject((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      options={["Residential", "Commercial"]}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Client"
                      value={newProject.client}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewProject((prev) => ({
                          ...prev,
                          client: e.target.value,
                        }))
                      }
                      placeholder="Client name"
                    />
                    <Input
                      label="Year"
                      value={newProject.year}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewProject((prev) => ({
                          ...prev,
                          year: e.target.value,
                        }))
                      }
                      placeholder="2024"
                    />
                    <Input
                      label="Location"
                      value={newProject.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewProject((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="City, State"
                    />
                  </div>

                  <TextArea
                    label="Description"
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewProject((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description"
                    rows={2}
                  />

                  <TextArea
                    label="Detailed Description"
                    value={newProject.details}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewProject((prev) => ({
                        ...prev,
                        details: e.target.value,
                      }))
                    }
                    placeholder="Detailed information..."
                    rows={4}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Project Images *{" "}
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        (Check "Featured" for slideshow)
                      </span>
                    </label>

                    {/* Image Grid with Controls */}
                    {newProjectImages.length > 0 && (
                      <div className="mt-4 mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newProjectImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-colors group"
                          >
                            {/* Image */}
                            <Image
                              src={img.url}
                              alt={`Image ${idx + 1}`}
                              fill
                              className="object-cover"
                            />

                            {/* Control Buttons - Top Right */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
                              {/* Move Up Button */}
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => moveNewProjectImageUp(idx)}
                                  className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors shadow-md"
                                  title="Move up"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                </button>
                              )}
                              {/* Move Down Button */}
                              {idx < newProjectImages.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveNewProjectImageDown(idx)}
                                  className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors shadow-md"
                                  title="Move down"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              )}
                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeNewProjectImage(idx)}
                                className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition-colors shadow-md"
                                title="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Featured Checkbox Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                <label className="flex items-center gap-1.5 bg-white/95 dark:bg-gray-800/95 px-2 py-1.5 rounded shadow-lg cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={img.featured}
                                    onChange={(e) =>
                                      toggleNewProjectFeatured(
                                        idx,
                                        e.target.checked
                                      )
                                    }
                                    className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                                  />
                                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                                    Featured
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Images Button */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleImageUpload(e, (newImageUrls) => {
                          const currentFeaturedCount = newProjectImages.filter(
                            (img) => img.featured
                          ).length;

                          // Create new image objects with featured flags
                          const newImages = newImageUrls.map((url, index) => ({
                            url,
                            featured: currentFeaturedCount === 0 && index < 3, // Auto-feature first 3 if none selected
                            order: newProjectImages.length + index,
                          }));

                          // Update both states
                          setNewProjectImages((prev) => [
                            ...prev,
                            ...newImages,
                          ]);
                          setNewProject((prev) => ({
                            ...prev,
                            images: [...prev.images, ...newImageUrls],
                          }));
                        })
                      }
                      className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-sm hover:border-amber-500 dark:hover:border-amber-500 transition-colors cursor-pointer"
                      id="new-project-images"
                      required={newProject.images.length === 0}
                    />
                    <label
                      htmlFor="new-project-images"
                      className="block mt-2 text-xs text-gray-500 dark:text-gray-400 text-center cursor-pointer"
                    >
                      Click to add images • First 3 images will be featured if
                      none selected
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 flex-1"
                      disabled={
                        isSavingProject ||
                        !newProject.title ||
                        newProject.images.length === 0
                      }
                    >
                      {isSavingProject ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {editingProject ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        <>{editingProject ? "Update Project" : "Add Project"}</>
                      )}
                    </Button>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Testimonials
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Client reviews and feedback
                </p>
              </div>
              <Button
                onClick={() => setShowAddTestimonial(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            {testimonials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No testimonials yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="testimonial-card bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto relative"
                  >
                    {/* Delete Button */}
                    <Button
                      onClick={() => {
                        if (confirm("Delete this testimonial?")) {
                          deleteTestimonial(testimonial._id || "");
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Profile Picture */}
                    {testimonial.image ? (
                      <div 
                        className="mb-4 mx-auto overflow-hidden rounded-full"
                        style={{
                          width: "112px",
                          height: "112px",
                        }}
                      >
                        <img
                          src={
                            typeof testimonial.image === "string"
                              ? testimonial.image
                              : testimonial.image.url
                          }
                          alt={testimonial.name}
                          className="w-full h-full object-cover object-center border-4 border-gray-100 shadow-md scale-110"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}

                    {/* Testimonial Content */}
                    <div className="mb-4">
                      <div className="text-4xl text-amber-500 mb-2">"</div>
                      <p className="text-gray-700 italic leading-relaxed">
                        {testimonial.content}
                      </p>
                    </div>

                    {/* Client Info */}
                    <div className="mb-3">
                      <p className="font-bold text-lg text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {testimonial.occupation}
                      </p>
                      {testimonial.projectType && (
                        <p className="text-amber-600 text-sm mt-1">
                          {testimonial.projectType}
                        </p>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center">
                      <StarRating rating={testimonial.rating} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddTestimonial && (
              <Modal
                onClose={() => setShowAddTestimonial(false)}
                title="Add New Testimonial"
              >
                <form onSubmit={handleAddTestimonial} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Client Name *"
                      value={newTestimonial.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTestimonial((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      label="Occupation *"
                      value={newTestimonial.occupation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTestimonial((prev) => ({
                          ...prev,
                          occupation: e.target.value,
                        }))
                      }
                      placeholder="Business Owner"
                      required
                    />
                  </div>

                  <Input
                    label="Project Type"
                    value={newTestimonial.projectType}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewTestimonial((prev) => ({
                        ...prev,
                        projectType: e.target.value,
                      }))
                    }
                    placeholder="e.g., Whole Home Renovation"
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating * (0.5 increments)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.5"
                        value={newTestimonial.rating.toString()} // Convert to string to avoid NaN
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewTestimonial((prev) => ({
                            ...prev,
                            rating: parseFloat(e.target.value) || 0, // Fallback to 0 if parsing fails
                          }))
                        }
                        className="w-24 px-3 py-2 border rounded-md"
                        required
                      />
                      <div className="flex gap-1">
                        <StarRating
                          rating={newTestimonial.rating}
                          showNumber={false}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {newTestimonial.rating} stars
                      </span>
                    </div>
                  </div>

                  <TextArea
                    label="Testimonial Content *"
                    value={newTestimonial.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewTestimonial((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Enter the client's testimonial..."
                    rows={5}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Profile Picture (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTestimonialImageUpload}
                      className="w-full border rounded p-2"
                    />
                    {newTestimonial.image && (
                      <div className="mt-2">
                        <img
                          src={newTestimonial.image}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowAddTestimonial(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 flex-1"
                    >
                      Add Testimonial
                    </Button>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}

        {/* IMAGES TAB */}
        {activeTab === "images" && (
          <ImagesManagementSection
            activeCategory={activeImageCategory}
            setActiveCategory={setActiveImageCategory}
            siteImages={siteImages}
            onAddImage={() => setShowAddImage(true)}
            onDeleteImage={deleteSiteImage}
            showAddModal={showAddImage}
            newImage={newSiteImage}
            setNewImage={setNewSiteImage}
            handleAddImage={handleAddSiteImage}
            onCloseModal={() => setShowAddImage(false)}
            handleSiteImageUpload={handleSiteImageUpload}
            isUploading={isUploading}
          />
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Stats</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  {editingStat === stat._id ? (
                    <div className="space-y-3">
                      <Input
                        label="Label"
                        value={editStatValue.label}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditStatValue((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                      />
                      <Input
                        label="Value"
                        value={editStatValue.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditStatValue((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveStat}
                          size="sm"
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingStat(null)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-amber-600 mb-2">
                          {stat.value}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {stat.label}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEditStat(stat)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === "services" && (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-10 h-10 text-amber-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Services Management
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">
                  Coming Soon
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                Service management functionality is currently under development.
                This feature will allow you to add, edit, and manage your
                interior design services directly from the admin dashboard.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Planned Features
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Add and manage service offerings</li>
                  <li>• Custom service descriptions and icons</li>
                  <li>• Service pricing and details</li>
                  <li>• Real-time updates to website</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Images Management Section Component
function ImagesManagementSection({
  activeCategory,
  setActiveCategory,
  siteImages,
  onAddImage,
  onDeleteImage,
  showAddModal,
  newImage,
  setNewImage,
  handleAddImage,
  onCloseModal,
  handleSiteImageUpload,
  isUploading,
}: any) {
  const categories = [
    {
      id: "hero",
      name: "Hero Carousel",
      icon: "🏠",
      description: "Homepage slideshow images",
    },
    {
      id: "logo",
      name: "Logo",
      icon: "🏷️",
      description: "Company logo variants",
    },
    {
      id: "about",
      name: "About Section",
      icon: "👤",
      description: "About page images",
    },
  ];

  const categoryImages = siteImages.filter(
    (img: any) => img.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Images</h2>
        <Button
          onClick={() => {
            // Set the category to match the active category before opening modal
            setNewImage((prev: any) => ({ ...prev, category: activeCategory }));
            onAddImage();
          }}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Category Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          // Calculate count for THIS specific category
          const categoryCount = siteImages.filter(
            (img: any) => img.category === category.id
          ).length;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                activeCategory === category.id
                  ? "border-amber-600 bg-amber-50 text-amber-800"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-medium mb-1">{category.name}</h3>
              <p className="text-xs text-gray-600">{category.description}</p>
              <div className="mt-2 text-xs font-medium">
                {categoryCount} images
              </div>
            </button>
          );
        })}
      </div>

      {/* Images Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {categories.find((c) => c.id === activeCategory)?.icon}
          {categories.find((c) => c.id === activeCategory)?.name}
          <span className="text-sm text-gray-500">
            ({categoryImages.length} images)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryImages.map((image: any) => (
            <div
              key={image._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={image.image?.url}
                  alt={image.altText || image.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onDeleteImage(image._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900">{image.title}</h4>
                <p className="text-sm text-gray-600">{image.section}</p>
                {image.variant && (
                  <p className="text-xs text-amber-600 mt-1">
                    {image.variant === "light"
                      ? "🌞 Light Mode"
                      : "🌙 Dark Mode"}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Order: {image.order}
                </p>
              </div>
            </div>
          ))}
        </div>

        {categoryImages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-lg mb-2">No {activeCategory} images yet</p>
            <p>Click "Add Image" to get started!</p>
          </div>
        )}
      </div>

      {/* Add Image Modal */}
      {showAddModal && (
        <Modal
          onClose={onCloseModal}
          title={`Add ${
            categories.find((c) => c.id === activeCategory)?.name
          } Image`}
        >
          <form onSubmit={handleAddImage} className="space-y-4">
            <Input
              label="Image Title *"
              value={newImage.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewImage((prev: any) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Hero Image 1"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Section"
                value={newImage.section}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewImage((prev: any) => ({
                    ...prev,
                    section: e.target.value,
                  }))
                }
                placeholder="e.g., main, secondary"
              />
              <Input
                label="Order"
                type="number"
                value={newImage.order.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewImage((prev: any) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            {/* Variant selector for logo category */}
            {activeCategory === "logo" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo Variant *
                </label>
                <select
                  value={newImage.variant || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewImage((prev: any) => ({
                      ...prev,
                      variant: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">Select variant...</option>
                  <option value="light">Light Mode Logo</option>
                  <option value="dark">Dark Mode Logo</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose which theme this logo should appear in
                </p>
              </div>
            )}

            <Input
              label="Alt Text"
              value={newImage.altText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewImage((prev: any) => ({
                  ...prev,
                  altText: e.target.value,
                }))
              }
              placeholder="Describe the image for accessibility"
            />

            <div>
              <label className="block text-sm font-medium mb-2">Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSiteImageUpload}
                className="w-full border rounded p-2"
                required
              />
              {newImage.image && (
                <div className="mt-2">
                  <img
                    src={newImage.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onCloseModal}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-amber-600 hover:bg-amber-700 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Adding..." : "Add Image"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Helper Functions
// Star Rating Component - CSS-based with proper half stars
function StarRating({
  rating,
  showNumber = true,
}: {
  rating: number;
  showNumber?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const halfFilled = rating >= star - 0.5 && rating < star;

          return (
            <div key={star} className="relative text-lg">
              {/* Background star */}
              <span className="text-gray-300">★</span>

              {/* Foreground star */}
              {filled && (
                <span className="absolute top-0 left-0 text-yellow-400">★</span>
              )}

              {/* Half star */}
              {halfFilled && (
                <span
                  className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  ★
                </span>
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Helper Components
function TabButton({ active, onClick, icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-md font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
        active
          ? "bg-amber-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-50 border"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ProjectCard({ project, onDelete, onEdit }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-900">
          {project.title}
        </h3>
        <p className="text-sm text-amber-600 mb-2">{project.category}</p>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Client and Year info */}
        {(project.client || project.year) && (
          <div className="text-xs text-gray-500 mb-4">
            {project.client && <p>Client: {project.client}</p>}
            {project.year && <p>Year: {project.year}</p>}
          </div>
        )}

        {/* Edit and Delete Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(project)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete(project._id || project.id)}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function Modal({ onClose, title, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
      />
    </div>
  );
}

function TextArea({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

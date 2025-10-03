"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/projects-context";
import { useTestimonials } from "@/contexts/testimonials-context";
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

  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

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

  // Testimonial states
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    projectType: "",
    content: "",
    rating: 5,
  });

  // Stats states
  const [stats, setStats] = useState([
    { id: 1, label: "Projects Completed", value: "250+", editable: false },
    { id: 2, label: "Happy Clients", value: "150+", editable: false },
    { id: 3, label: "Years Experience", value: "15+", editable: false },
    { id: 4, label: "Design Awards", value: "25+", editable: false },
  ]);
  const [editingStat, setEditingStat] = useState<number | null>(null);
  const [editStatValue, setEditStatValue] = useState({ label: "", value: "" });

  // About section state
  const [aboutData, setAboutData] = useState({
    title: "About Darpan Interiors",
    subtitle: "Crafting Beautiful Spaces Since 2010",
    description:
      "We are a premier interior design firm specializing in creating timeless, elegant spaces that reflect our clients' unique personalities and lifestyles.",
    mission:
      "To transform spaces into beautiful, functional environments that enhance quality of life.",
    vision:
      "To be recognized as the leading interior design firm known for innovation, quality, and client satisfaction.",
  });
  const [editingAbout, setEditingAbout] = useState(false);

  // Services state
  const [services, setServices] = useState([
    {
      id: 1,
      title: "Residential Design",
      description: "Complete home interior design solutions",
      icon: "🏠",
    },
    {
      id: 2,
      title: "Commercial Design",
      description: "Office and retail space design",
      icon: "🏢",
    },
    {
      id: 3,
      title: "Space Planning",
      description: "Optimal layout and functionality",
      icon: "📐",
    },
    {
      id: 4,
      title: "Furniture Selection",
      description: "Custom and curated furniture pieces",
      icon: "🛋️",
    },
  ]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon: "🎨",
  });

  // Image management states
  const [imageSection, setImageSection] = useState("hero");
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [aboutImage, setAboutImage] = useState("");
  const [logoImage, setLogoImage] = useState("");

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
    try {
      await addProject(newProject as any);
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
      alert("Project added successfully!");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditProjectData({
      title: project.title,
      category: project.category,
      client: project.client || "",
      year: project.year || "",
      location: project.location || "",
      description: project.description || "",
      details: project.details || "",
      images: project.images || [],
    });
    setShowEditProject(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?._id) return;

    try {
      await updateProject(editingProject._id, editProjectData);
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
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
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
      await addTestimonial({
        name: newTestimonial.name,
        content: newTestimonial.content,
        rating: newTestimonial.rating,
      } as any);
      setNewTestimonial({
        name: "",
        role: "",
        projectType: "",
        content: "",
        rating: 5,
      });
      setShowAddTestimonial(false);
      alert("Testimonial added successfully!");
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial. Please try again.");
    }
  };

  const handleEditStat = (stat: any) => {
    setEditingStat(stat.id);
    setEditStatValue({ label: stat.label, value: stat.value });
  };

  const handleSaveStat = () => {
    setStats(
      stats.map((s) => (s.id === editingStat ? { ...s, ...editStatValue } : s))
    );
    setEditingStat(null);
  };

  const handleSaveAbout = () => {
    setEditingAbout(false);
    alert("About section updated successfully!");
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setServices([...services, { id: Date.now(), ...newService }]);
    setNewService({ title: "", description: "", icon: "🎨" });
    setShowAddService(false);
  };

  const handleDeleteService = (id: number) => {
    if (confirm("Delete this service?")) {
      setServices(services.filter((s) => s.id !== id));
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
            active={activeTab === "about"}
            onClick={() => setActiveTab("about")}
            icon={<Info className="w-4 h-4" />}
          >
            About
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
                        (First will be main)
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleImageUpload(e, (images) =>
                          setEditProjectData((prev) => ({
                            ...prev,
                            images: [...prev.images, ...images],
                          }))
                        )
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                    {editProjectData.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {editProjectData.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded overflow-hidden"
                          >
                            <Image
                              src={img}
                              alt={`Preview ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            {idx === 0 && (
                              <div className="absolute top-1 left-1 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                                Main
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setEditProjectData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, i) => i !== idx
                                  ),
                                }))
                              }
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                        !editProjectData.title ||
                        editProjectData.images.length === 0
                      }
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
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
                    <label className="block text-sm font-medium mb-2">
                      Project Images *{" "}
                      <span className="text-gray-500 text-xs">
                        (First will be main)
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleImageUpload(e, (images) =>
                          setNewProject((prev) => ({ ...prev, images }))
                        )
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      required={
                        newProject.images.length === 0 && !editingProject
                      }
                    />
                    {newProject.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {newProject.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded overflow-hidden"
                          >
                            <Image
                              src={img}
                              alt={`Preview ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            {idx === 0 && (
                              <div className="absolute top-1 left-1 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                        !newProject.title || newProject.images.length === 0
                      }
                    >
                      {editingProject ? "Update Project" : "Add Project"}
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
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {testimonial.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          if (confirm("Delete this testimonial?")) {
                            deleteTestimonial(testimonial._id || "");
                          }
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600 text-sm italic line-clamp-4">
                      "{testimonial.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {showAddTestimonial && (
              <Modal
                onClose={() => setShowAddTestimonial(false)}
                title="Add Testimonial"
              >
                <form onSubmit={handleAddTestimonial} className="space-y-4">
                  <Input
                    label="Client Name *"
                    value={newTestimonial.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewTestimonial((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Sarah Mitchell"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() =>
                            setNewTestimonial((prev) => ({ ...prev, rating }))
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= newTestimonial.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            } cursor-pointer hover:scale-110 transition-transform`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <TextArea
                    label="Content *"
                    value={newTestimonial.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewTestimonial((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Client testimonial..."
                    rows={5}
                    required
                  />

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
                      className="bg-green-600 hover:bg-green-700 flex-1"
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Images</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Sidebar */}
              <div className="bg-white rounded-lg shadow p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Image Sections
                </h3>
                {(
                  [
                    { id: "hero", label: "Hero Carousel", icon: "🏠" },
                    { id: "about", label: "About", icon: "👥" },
                    { id: "services", label: "Services", icon: "⚙️" },
                    { id: "logo", label: "Logo", icon: "🎨" },
                  ] as const
                ).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setImageSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      imageSection === section.id
                        ? "bg-amber-50 border-2 border-amber-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-2xl mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Main Content */}
              <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
                {imageSection === "hero" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Hero Images</h3>
                      <Button
                        onClick={() =>
                          document.getElementById("hero-upload")?.click()
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Images
                      </Button>
                      <input
                        id="hero-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleHeroImagesUpload}
                        className="hidden"
                      />
                    </div>

                    {heroImages.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">No hero images</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {heroImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-video rounded-lg overflow-hidden group"
                          >
                            <Image
                              src={img}
                              alt={`Hero ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() =>
                                setHeroImages(
                                  heroImages.filter((_, i) => i !== idx)
                                )
                              }
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {imageSection === "logo" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Website Logo</h3>
                    <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
                      {logoImage ? (
                        <Image
                          src={logoImage}
                          alt="Logo"
                          width={200}
                          height={100}
                          className="mx-auto"
                        />
                      ) : (
                        <div className="text-gray-500">No logo uploaded</div>
                      )}
                    </div>
                    <Button
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {imageSection === "about" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">About Image</h3>
                    <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
                      {aboutImage ? (
                        <Image
                          src={aboutImage}
                          alt="About"
                          width={400}
                          height={300}
                          className="mx-auto"
                        />
                      ) : (
                        <div className="text-gray-500">
                          No about image uploaded
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() =>
                        document.getElementById("about-upload")?.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      id="about-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleImageUpload(e, (images) =>
                          setAboutImage(images[0])
                        )
                      }
                      className="hidden"
                    />
                  </div>
                )}

                {imageSection === "services" && (
                  <div className="text-center py-12">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Services images coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Stats</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  {editingStat === stat.id ? (
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

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage About</h2>
              {!editingAbout ? (
                <Button onClick={() => setEditingAbout(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <Button onClick={handleSaveAbout} className="bg-green-600">
                  Save
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              {editingAbout ? (
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={aboutData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAboutData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Subtitle"
                    value={aboutData.subtitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAboutData((prev) => ({
                        ...prev,
                        subtitle: e.target.value,
                      }))
                    }
                  />
                  <TextArea
                    label="Description"
                    value={aboutData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setAboutData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                  <TextArea
                    label="Mission"
                    value={aboutData.mission}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setAboutData((prev) => ({
                        ...prev,
                        mission: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                  <TextArea
                    label="Vision"
                    value={aboutData.vision}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setAboutData((prev) => ({
                        ...prev,
                        vision: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{aboutData.title}</h3>
                  <p className="text-amber-600">{aboutData.subtitle}</p>
                  <p className="text-gray-600">{aboutData.description}</p>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <h4 className="font-semibold mb-2">Mission</h4>
                      <p className="text-gray-600 text-sm">
                        {aboutData.mission}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Vision</h4>
                      <p className="text-gray-600 text-sm">
                        {aboutData.vision}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Services</h2>
              <Button onClick={() => setShowAddService(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{service.icon}</div>
                    <Button
                      onClick={() => handleDeleteService(service.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              ))}
            </div>

            {showAddService && (
              <Modal
                onClose={() => setShowAddService(false)}
                title="Add Service"
              >
                <form onSubmit={handleAddService} className="space-y-4">
                  <Input
                    label="Title *"
                    value={newService.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewService((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                  <TextArea
                    label="Description *"
                    value={newService.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewService((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    required
                  />
                  <Input
                    label="Icon (Emoji)"
                    value={newService.icon}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewService((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowAddService(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add
                    </Button>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}
      </div>
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

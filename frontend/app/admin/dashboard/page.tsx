"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/projects-context";
import { useTestimonials } from "@/contexts/testimonials-context";
import { Trash2, Plus, X, Edit, LogOut } from "lucide-react";
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
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } =
    useTestimonials();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("projects");

  const [newProject, setNewProject] = useState<Omit<Project, "_id" | "id">>({
    title: "",
    category: "Residential",
    description: "",
    details: "",
    client: "",
    year: "",
    location: "",
    image: "",
    images: [],
  });

  const [editProject, setEditProject] = useState<Omit<Project, "_id" | "id">>({
    title: "",
    category: "Residential",
    description: "",
    details: "",
    client: "",
    year: "",
    location: "",
    image: "",
    images: [],
  });

  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    content: "",
    rating: 5,
  });

  // Verify admin access
  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          console.log("Verifying admin access for:", session.user.email);

          const response = await apiClient.post("/auth/verify-admin", {
            email: session.user.email,
            name: session.user.name,
          });

          console.log("Admin verification response:", response.data);

          if (response.data.isAdmin) {
            setIsAdmin(true);
            localStorage.setItem("token", response.data.token);
          } else {
            router.push("/admin/error?error=AccessDenied");
          }
        } catch (error: any) {
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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imagePromises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((images) => {
        if (isEdit) {
          setEditProject((prev) => ({
            ...prev,
            image: prev.image || images[0],
            images: [...prev.images, ...images],
          }));
        } else {
          setNewProject((prev) => ({
            ...prev,
            image: prev.image || images[0],
            images: [...prev.images, ...images],
          }));
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.title && newProject.image) {
      try {
        await addProject(newProject);
        setNewProject({
          title: "",
          category: "Residential",
          description: "",
          details: "",
          client: "",
          year: "",
          location: "",
          image: "",
          images: [],
        });
        setShowAddForm(false);
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Failed to add project. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    await signOut({ callbackUrl: "/" });
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTestimonial(newTestimonial);
      setNewTestimonial({ name: "", content: "", rating: 5 });
      setShowAddTestimonial(false);
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial. Please try again.");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        alert("Failed to delete testimonial. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {session?.user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                </div>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </div>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-red-600 hover:text-red-700 border-red-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "projects"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Manage Projects
          </Button>
          <Button
            onClick={() => setActiveTab("testimonials")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "testimonials"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Manage Testimonials
          </Button>
        </div>

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Projects</h2>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            {projectsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">
                  No projects yet. Add your first project!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project._id || project.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{project.category}</p>
                      {project.description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() =>
                            handleDeleteProject(project._id || project.id || "")
                          }
                          className="bg-red-500 hover:bg-red-600 text-white w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Project Form Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Add New Project</h2>
                      <Button
                        onClick={() => setShowAddForm(false)}
                        variant="ghost"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          placeholder="Enter project title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Category
                        </label>
                        <select
                          value={newProject.category}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          <option>Residential</option>
                          <option>Commercial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) =>
                            setNewProject((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          placeholder="Brief project description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Project Images *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, false)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                          required={newProject.images.length === 0}
                        />
                        {newProject.images.length > 0 && (
                          <div className="mt-4 grid grid-cols-4 gap-2">
                            {newProject.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square"
                              >
                                <Image
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          onClick={() => setShowAddForm(false)}
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
                          Add Project
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Testimonials</h2>
              <Button
                onClick={() => setShowAddTestimonial(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            {testimonials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">
                  No testimonials yet. Add your first testimonial!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 mb-2 line-clamp-3">
                      {testimonial.content}
                    </p>
                    <p className="text-sm text-amber-600 mb-4">
                      Rating: {testimonial.rating}/5
                    </p>
                    <Button
                      onClick={() =>
                        handleDeleteTestimonial(testimonial._id || "")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Testimonial Modal */}
            {showAddTestimonial && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Add Testimonial</h2>
                      <Button
                        onClick={() => setShowAddTestimonial(false)}
                        variant="ghost"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <form onSubmit={handleAddTestimonial} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={newTestimonial.name}
                          onChange={(e) =>
                            setNewTestimonial((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Content *
                        </label>
                        <textarea
                          value={newTestimonial.content}
                          onChange={(e) =>
                            setNewTestimonial((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Rating (1-5) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={newTestimonial.rating}
                          onChange={(e) =>
                            setNewTestimonial((prev) => ({
                              ...prev,
                              rating: parseInt(e.target.value),
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          required
                        />
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
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

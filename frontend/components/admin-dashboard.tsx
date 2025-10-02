"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useProjects } from "../contexts/projects-context"
import { Trash2, Plus, X, Edit, Save, Upload, Settings, LogOut } from "lucide-react"
import SettingsModal from "@/components/settings-modal"
import ImageManagementSection from "./image-management-section"
import TestimonialsManagement from "./testimonials-management"
import { TestimonialsProvider } from "../contexts/testimonials-context"

interface ImageManagement {
  hero: string[]
  about: string
  services: Record<string, string>
  testimonials: Record<string, string>
  general: string[]
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const { projects, addProject, updateProject, deleteProject } = useProjects()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Residential",
    description: "",
    details: "",
    client: "",
    year: "",
    location: "",
    image: "",
    images: [] as string[],
  })

  const [editProject, setEditProject] = useState({
    title: "",
    category: "Residential",
    description: "",
    details: "",
    client: "",
    year: "",
    location: "",
    image: "",
    images: [] as string[],
  })

  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")
  const [imageManagement, setImageManagement] = useState<ImageManagement>({
    hero: [],
    about: "",
    services: {},
    testimonials: {},
    general: [],
  })

  useEffect(() => {
    const savedImages = localStorage.getItem("darpan_images")
    if (savedImages) {
      setImageManagement(JSON.parse(savedImages))
    } else {
      const defaultImages: ImageManagement = {
        hero: [
          "/placeholder.svg?height=600&width=800&text=Luxury+Interior+Design+Showcase+Living+Room",
          "/placeholder.svg?height=600&width=800&text=Modern+Kitchen+with+Marble+Island+and+Brass+Fixtures",
          "/placeholder.svg?height=600&width=800&text=Elegant+Master+Bedroom+with+Tufted+Headboard",
          "/placeholder.svg?height=600&width=800&text=Sophisticated+Dining+Room+with+Crystal+Chandelier",
          "/placeholder.svg?height=600&width=800&text=Luxury+Bathroom+with+Freestanding+Tub+and+Natural+Stone",
        ],
        about: "/placeholder.svg?height=500&width=600&text=Interior+Designer+at+Work+with+Fabric+Samples",
        services: {},
        testimonials: {},
        general: [],
      }
      setImageManagement(defaultImages)
      localStorage.setItem("darpan_images", JSON.stringify(defaultImages))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(imageManagement).length > 0) {
      localStorage.setItem("darpan_images", JSON.stringify(imageManagement))
    }
  }, [imageManagement])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const imagePromises = fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(imagePromises).then((images) => {
        if (isEdit) {
          setEditProject((prev) => ({
            ...prev,
            image: prev.image || (images[0] as string),
            images: [...prev.images, ...(images as string[])],
          }))
        } else {
          setNewProject((prev) => ({
            ...prev,
            image: prev.image || (images[0] as string),
            images: [...prev.images, ...(images as string[])],
          }))
        }
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProject.title && newProject.image) {
      addProject(newProject)
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
      })
      setShowAddForm(false)
    }
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProject && editProject.title && editProject.image) {
      updateProject(editingProject, editProject)
      setEditingProject(null)
      setEditProject({
        title: "",
        category: "Residential",
        description: "",
        details: "",
        client: "",
        year: "",
        location: "",
        image: "",
        images: [],
      })
    }
  }

  const startEditing = (project: any) => {
    setEditingProject(project.id)
    setEditProject({
      title: project.title || "",
      category: project.category || "Residential",
      description: project.description || "",
      details: project.details || "",
      client: project.client || "",
      year: project.year || "",
      location: project.location || "",
      image: project.image || "",
      images: project.images || [],
    })
  }

  const cancelEditing = () => {
    setEditingProject(null)
    setEditProject({
      title: "",
      category: "Residential",
      description: "",
      details: "",
      client: "",
      year: "",
      location: "",
      image: "",
      images: [],
    })
  }

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditProject((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        image: index === 0 && prev.images.length > 1 ? prev.images[1] : prev.image,
      }))
    } else {
      setNewProject((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        image: index === 0 && prev.images.length > 1 ? prev.images[1] : prev.image,
      }))
    }
  }

  const setAsMainImage = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditProject((prev) => ({
        ...prev,
        image: prev.images[index],
      }))
    } else {
      setNewProject((prev) => ({
        ...prev,
        image: prev.images[index],
      }))
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-25 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-orange-50 to-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-light text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              {session?.user && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-600">{session.user.email}</p>
                  </div>
                  {session.user.image && (
                    <Image
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "Admin"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                onClick={() => setShowSettings(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="text-gray-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/60 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "projects"
                ? "bg-amber-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            Manage Projects
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "testimonials"
                ? "bg-amber-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            Manage Testimonials
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "images"
                ? "bg-amber-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            Manage Images
          </button>
        </div>

        {/* Add Project Button */}
        {activeTab === "projects" && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-light text-gray-900">Manage Projects</h2>
            <Button onClick={() => setShowAddForm(true)} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        )}

        {/* Projects Management Tab */}
        {activeTab === "projects" && (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gradient-to-br from-white to-orange-25 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(project)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(project.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                    {project.description && <p className="text-sm text-gray-600">{project.description}</p>}
                    {project.client && <p className="text-xs text-gray-500 mt-2">Client: {project.client}</p>}
                    {project.year && <p className="text-xs text-gray-500">Year: {project.year}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Project Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-white via-orange-25 to-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-light text-gray-900">Add New Project</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter project title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={newProject.category}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                        <input
                          type="text"
                          value={newProject.client}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, client: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Client name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={newProject.year}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, year: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="2024"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={newProject.location}
                          onChange={(e) => setNewProject((prev) => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Project location"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Brief project description"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                      <textarea
                        value={newProject.details}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, details: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Detailed project description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Images
                        <span className="text-sm text-gray-500 ml-2">
                          (Select multiple images - first will be main image)
                        </span>
                      </label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNewProject((prev) => ({ ...prev, images: [], image: "" }))}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          Clear All Images
                        </Button>
                        <span className="text-xs text-gray-500 flex items-center">
                          {newProject.images.length} image{newProject.images.length !== 1 ? "s" : ""} selected
                        </span>
                      </div>
                      <input
                        id="new-project-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      {newProject.images.length > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-gray-600">Selected Images ({newProject.images.length})</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("new-project-images")?.click()}
                              className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Add More
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {newProject.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  width={150}
                                  height={100}
                                  className="rounded-lg object-cover w-full h-24 border-2 border-transparent group-hover:border-amber-200"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <div className="flex gap-1">
                                    {newProject.image !== image && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setAsMainImage(index, false)}
                                        className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
                                      >
                                        Set Main
                                      </Button>
                                    )}
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => removeImage(index, false)}
                                      className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-6"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                {newProject.image === image && (
                                  <div className="absolute top-1 left-1 bg-amber-600 text-white text-xs px-2 py-1 rounded flex items-center">
                                    <span className="mr-1">★</span>
                                    Main
                                  </div>
                                )}
                                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                      Add Project
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Project Modal */}
            {editingProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-white via-orange-25 to-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-light text-gray-900">Edit Project</h3>
                    <Button variant="ghost" size="icon" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                        <input
                          type="text"
                          value={editProject.title}
                          onChange={(e) => setEditProject((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter project title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={editProject.category}
                          onChange={(e) => setEditProject((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                        <input
                          type="text"
                          value={editProject.client}
                          onChange={(e) => setEditProject((prev) => ({ ...prev, client: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Client name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={editProject.year}
                          onChange={(e) => setEditProject((prev) => ({ ...prev, year: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="2024"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={editProject.location}
                          onChange={(e) => setEditProject((prev) => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Project location"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={editProject.description}
                        onChange={(e) => setEditProject((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Brief project description"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                      <textarea
                        value={editProject.details}
                        onChange={(e) => setEditProject((prev) => ({ ...prev, details: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Detailed project description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Project Images</label>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e, true)}
                            className="hidden"
                            id="edit-image-upload"
                          />
                          <label htmlFor="edit-image-upload" className="cursor-pointer">
                            <Button type="button" size="sm" className="bg-green-600 hover:bg-green-700">
                              <Upload className="h-4 w-4 mr-2" />
                              Add More Images
                            </Button>
                          </label>
                        </div>
                      </div>
                      {editProject.images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Current Images ({editProject.images.length})</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {editProject.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  width={150}
                                  height={100}
                                  className="rounded-lg object-cover w-full h-20"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <div className="flex gap-1">
                                    {editProject.image !== image && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setAsMainImage(index, true)}
                                        className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                                      >
                                        Main
                                      </Button>
                                    )}
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => removeImage(index, true)}
                                      className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                {editProject.image === image && (
                                  <span className="absolute top-1 left-1 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={cancelEditing} className="flex-1 bg-transparent">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* Testimonials Management Tab */}
        {activeTab === "testimonials" && (
          <TestimonialsProvider>
            <TestimonialsManagement />
          </TestimonialsProvider>
        )}

        {/* Image Management Tab */}
        {activeTab === "images" && (
          <ImageManagementSection imageManagement={imageManagement} setImageManagement={setImageManagement} />
        )}

        {/* Settings Modal */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} isAdmin={true} />}
      </div>
    </div>
  )
}

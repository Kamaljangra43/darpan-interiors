"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTestimonials } from "../contexts/testimonials-context"
import StarRating from "./star-rating"
import { Plus, Edit, Trash2, Save, X, User, MessageSquare, Briefcase } from "lucide-react"

export default function TestimonialsManagement() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    project: "",
  })

  const [editTestimonial, setEditTestimonial] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    project: "",
  })

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTestimonial.name && newTestimonial.content && newTestimonial.role) {
      addTestimonial(newTestimonial)
      setNewTestimonial({
        name: "",
        role: "",
        content: "",
        rating: 5,
        project: "",
      })
      setShowAddForm(false)
    }
  }

  const startEditing = (testimonial: any) => {
    setEditingId(testimonial.id)
    setEditTestimonial({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      project: testimonial.project,
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId && editTestimonial.name && editTestimonial.content && editTestimonial.role) {
      updateTestimonial(editingId, editTestimonial)
      setEditingId(null)
      setEditTestimonial({
        name: "",
        role: "",
        content: "",
        rating: 5,
        project: "",
      })
    }
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTestimonial({
      name: "",
      role: "",
      content: "",
      rating: 5,
      project: "",
    })
  }

  const handleDelete = (id: number) => {
    deleteTestimonial(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-gray-900">Manage Testimonials</h2>
          <p className="text-gray-600 mt-1">Add, edit, and manage client testimonials</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No testimonials yet</p>
            <Button variant="outline" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-white to-orange-25 rounded-lg p-6 shadow-sm border border-gray-200"
            >
              {editingId === testimonial.id ? (
                // Edit Form
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={editTestimonial.name}
                        onChange={(e) => setEditTestimonial((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Client name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="h-4 w-4 inline mr-1" />
                        Role & Location *
                      </label>
                      <input
                        type="text"
                        value={editTestimonial.role}
                        onChange={(e) => setEditTestimonial((prev) => ({ ...prev, role: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="e.g., Homeowner, Beverly Hills"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <input
                      type="text"
                      value={editTestimonial.project}
                      onChange={(e) => setEditTestimonial((prev) => ({ ...prev, project: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Whole Home Renovation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                    <StarRating
                      rating={editTestimonial.rating}
                      onRatingChange={(rating) => setEditTestimonial((prev) => ({ ...prev, rating }))}
                      size="lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Testimonial Content *
                    </label>
                    <textarea
                      value={editTestimonial.content}
                      onChange={(e) => setEditTestimonial((prev) => ({ ...prev, content: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Enter the client's testimonial..."
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                // Display Mode
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                        <StarRating rating={testimonial.rating} readonly size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{testimonial.role}</p>
                      {testimonial.project && (
                        <p className="text-xs text-amber-600 font-medium">{testimonial.project}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(testimonial)}
                        className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirmId(testimonial.id)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 italic border-l-4 border-amber-400 pl-4 py-2 bg-amber-50/50 rounded-r-lg">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="text-xs text-gray-500">Added: {testimonial.createdAt.toLocaleDateString()}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Testimonial Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white via-orange-25 to-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-gray-900">Add New Testimonial</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="h-4 w-4 inline mr-1" />
                    Role & Location *
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Homeowner, Beverly Hills"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <input
                  type="text"
                  value={newTestimonial.project}
                  onChange={(e) => setNewTestimonial((prev) => ({ ...prev, project: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Whole Home Renovation, Kitchen Remodel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rating *</label>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={newTestimonial.rating}
                    onRatingChange={(rating) => setNewTestimonial((prev) => ({ ...prev, rating }))}
                    size="lg"
                  />
                  <span className="text-sm text-gray-600">
                    ({newTestimonial.rating} star{newTestimonial.rating !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Testimonial Content *
                </label>
                <textarea
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  rows={5}
                  placeholder="Enter the client's testimonial. What did they love about your work?"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{newTestimonial.content.length}/500 characters</p>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Delete Testimonial</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this testimonial? This will permanently remove it from your website.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-600 hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

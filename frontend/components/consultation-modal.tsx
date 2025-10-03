"use client"

import type React from "react"
import { useTheme } from "../contexts/theme-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar, User, MessageSquare } from "lucide-react"

interface ConsultationModalProps {
  onClose: () => void
}

export default function ConsultationModal({ onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    projectType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const { isDarkMode } = useTheme()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        })
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferredDate: "",
          preferredTime: "",
          projectType: "",
          message: "",
        })
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to book consultation",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
        >
          <div>
            <h2 className={`text-2xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Book Free Consultation
            </h2>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
              Schedule a complimentary design consultation
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : ""}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? isDarkMode
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-green-50 text-green-800 border border-green-200"
                  : isDarkMode
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3
                className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}
              >
                <User className={`h-5 w-5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Consultation Preferences */}
            <div>
              <h3
                className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}
              >
                <Calendar className={`h-5 w-5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                Consultation Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Preferred Time
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div>
              <h3
                className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}
              >
                <MessageSquare className={`h-5 w-5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                Project Information
              </h3>
              <div className="mb-4">
                <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select project type</option>
                  <option value="residential">Residential Design</option>
                  <option value="commercial">Commercial Design</option>
                  <option value="kitchen-bath">Kitchen & Bath</option>
                  <option value="renovation">Luxury Renovation</option>
                  <option value="furniture">Furniture & Styling</option>
                  <option value="consultation">Design Consultation</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Tell us about your project
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="Describe your vision, timeline, budget range, and any specific requirements..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className={`flex-1 ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600" : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"}`}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${isDarkMode ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" : "bg-amber-600 hover:bg-amber-700"} text-white`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Book Consultation"}
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div
            className={`mt-6 p-4 rounded-lg ${isDarkMode ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50"}`}
          >
            <h4 className={`font-medium ${isDarkMode ? "text-amber-400" : "text-amber-900"} mb-2`}>What to Expect:</h4>
            <ul className={`text-sm ${isDarkMode ? "text-amber-300/90" : "text-amber-800"} space-y-1`}>
              <li>• 60-minute complimentary consultation</li>
              <li>• Discussion of your vision and requirements</li>
              <li>• Initial design concepts and recommendations</li>
              <li>• Project timeline and investment overview</li>
              <li>• No obligation - just expert advice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

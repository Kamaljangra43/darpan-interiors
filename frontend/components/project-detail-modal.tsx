"use client"

import { X, Calendar, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "../contexts/theme-context"
import type { Project } from "../types/project"
import { useState } from "react"
import Image from "next/image"

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const { isDarkMode } = useTheme()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <Card
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
        } shadow-2xl`}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div
            className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
              isDarkMode ? "border-gray-700 bg-gray-800/95" : "border-gray-200 bg-white/95"
            } backdrop-blur-sm`}
          >
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{project.title}</h2>
              <Badge
                variant="secondary"
                className={`mt-2 ${isDarkMode ? "bg-amber-500/20 text-amber-400" : "bg-amber-500/20 text-amber-600"}`}
              >
                {project.category}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`${
                isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Image Gallery */}
          <div className="relative">
            <div className="relative w-full h-96">
              <Image
                src={project.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
            </div>
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Project Details */}
          <div className="p-6 space-y-6">
            {/* Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.client && (
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Client</p>
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{project.client}</p>
                  </div>
                </div>
              )}
              {project.year && (
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Year</p>
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{project.year}</p>
                  </div>
                </div>
              )}
              {project.location && (
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Location</p>
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{project.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Overview
                </h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{project.description}</p>
              </div>
            )}

            {/* Detailed Description */}
            {project.details && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Project Details
                </h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} whitespace-pre-line`}>
                  {project.details}
                </p>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {project.images.length > 1 && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Gallery</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? isDarkMode
                            ? "border-amber-400"
                            : "border-amber-600"
                          : isDarkMode
                            ? "border-gray-700 hover:border-gray-600"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectDetailModal

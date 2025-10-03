"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, User } from "lucide-react"
import type { Project } from "../contexts/projects-context"
import ImageViewerModal from "./image-viewer-modal"
import { useTheme } from "../contexts/theme-context"

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const { isDarkMode } = useTheme()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [imageViewerIndex, setImageViewerIndex] = useState(0)

  const images = project.images || [project.image]

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setShowLightbox(true)
  }

  const openImageViewer = (index: number) => {
    setImageViewerIndex(index)
    setShowImageViewer(true)
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div
          className={`${isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-gradient-to-br from-white via-orange-25 to-gray-50 border border-gray-200"} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center p-6 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
          >
            <div>
              <h2 className={`text-3xl font-light ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
                {project.title}
              </h2>
              <span
                className={`inline-block ${isDarkMode ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-amber-100 text-amber-800"} px-3 py-1 rounded-full text-sm font-medium`}
              >
                {project.category}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`${isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Project Details */}
              <div>
                <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                  Project Details
                </h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6 leading-relaxed`}>
                  {project.details || project.description}
                </p>

                <div className="space-y-3">
                  {project.client && (
                    <div className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <User className={`h-4 w-4 mr-3 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                      <span className="font-medium mr-2">Client:</span>
                      <span>{project.client}</span>
                    </div>
                  )}
                  {project.year && (
                    <div className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <Calendar className={`h-4 w-4 mr-3 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                      <span className="font-medium mr-2">Year:</span>
                      <span>{project.year}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <MapPin className={`h-4 w-4 mr-3 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                      <span className="font-medium mr-2">Location:</span>
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Image */}
              <div>
                <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                  Featured Image
                </h3>
                <div className="relative">
                  <Image
                    src={images[selectedImageIndex] || "/placeholder.svg"}
                    alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover rounded-lg shadow-lg cursor-pointer"
                    onClick={() => openImageViewer(selectedImageIndex)}
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "bg-gray-800/80 hover:bg-gray-700 text-white" : "bg-white/80 hover:bg-white text-gray-800"}`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "bg-gray-800/80 hover:bg-gray-700 text-white" : "bg-white/80 hover:bg-white text-gray-800"}`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div>
              <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                Project Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                      index === selectedImageIndex
                        ? `ring-2 ${isDarkMode ? "ring-amber-400" : "ring-amber-500"} ring-offset-2 ${isDarkMode ? "ring-offset-gray-900" : "ring-offset-white"}`
                        : "hover:opacity-80"
                    }`}
                    onClick={() => openImageViewer(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} - Image ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-60">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <Image
              src={images[selectedImageIndex] || "/placeholder.svg"}
              alt={`${project.title} - Image ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-16">
                <div className="flex space-x-2 bg-black/50 p-2 rounded-lg">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-12 h-8 rounded overflow-hidden transition-all ${
                        index === selectedImageIndex ? "ring-2 ring-white" : "opacity-60 hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        width={48}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Image Viewer Modal */}
      {showImageViewer && (
        <ImageViewerModal
          images={images}
          initialIndex={imageViewerIndex}
          projectTitle={project.title}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  )
}

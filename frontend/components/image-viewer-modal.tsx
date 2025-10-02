"use client"

import { X, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "../contexts/theme-context"
import { useState } from "react"
import Image from "next/image"

interface ImageViewerModalProps {
  imageUrl: string
  onClose: () => void
}

export function ImageViewerModal({ imageUrl, onClose }: ImageViewerModalProps) {
  const { isDarkMode } = useTheme()
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = "darpan-interiors-image.jpg"
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 ${
            isDarkMode ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-sm`}
        >
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className={`${
                isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className={`${
                isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className={`${
                isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Download className="h-5 w-5" />
            </Button>
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
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div style={{ transform: `scale(${zoom / 100})` }} className="transition-transform duration-200 relative">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Full size view"
              width={1200}
              height={800}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageViewerModal

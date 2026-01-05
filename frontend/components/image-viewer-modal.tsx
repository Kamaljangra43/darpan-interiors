"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface ImageViewerModalProps {
  imageUrl?: string;
  images?: string[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageViewerModal({
  imageUrl,
  images,
  initialIndex = 0,
  onClose,
}: ImageViewerModalProps) {
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Create image array from either prop
  const imageArray = images || (imageUrl ? [imageUrl] : []);

  // Return null if no images provided
  if (imageArray.length === 0) {
    return null;
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (imageArray.length > 1) {
            setCurrentIndex(
              (prev) => (prev - 1 + imageArray.length) % imageArray.length
            );
          }
          break;
        case "ArrowRight":
          if (imageArray.length > 1) {
            setCurrentIndex((prev) => (prev + 1) % imageArray.length);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [imageArray.length, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const goToPrevious = () => {
    if (imageArray.length > 1) {
      setCurrentIndex(
        (prev) => (prev - 1 + imageArray.length) % imageArray.length
      );
    }
  };

  const goToNext = () => {
    if (imageArray.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % imageArray.length);
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageArray[currentIndex];
    link.download = `image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white border border-white/20"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Navigation Arrows - Only show if multiple images */}
        {imageArray.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border border-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border border-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Image Container */}
        <div className="relative max-w-full max-h-full">
          <img
            src={imageArray[currentIndex] || "/placeholder.svg"}
            alt={`Image ${currentIndex + 1} of ${imageArray.length}`}
            className={`max-w-full max-h-[90vh] object-contain transition-transform duration-300 ${
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {/* Image Counter */}
          {imageArray.length > 1 && (
            <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-white/20">
              {currentIndex + 1} / {imageArray.length}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsZoomed(!isZoomed)}
              className="bg-black/20 hover:bg-black/40 text-white border border-white/20"
            >
              {isZoomed ? (
                <ZoomOut className="h-5 w-5" />
              ) : (
                <ZoomIn className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={downloadImage}
              className="bg-black/20 hover:bg-black/40 text-white border border-white/20"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Navigation - Only show if multiple images */}
        {imageArray.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 max-w-full overflow-x-auto px-4">
            {imageArray.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-white scale-110"
                    : "border-white/30 hover:border-white/60"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

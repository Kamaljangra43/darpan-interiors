"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  User,
  ImageIcon,
} from "lucide-react";
import type { Project } from "@/types/project";
import ImageViewerModal from "./image-viewer-modal";
import { useTheme } from "../contexts/theme-context";

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

// Section 1: Featured Slideshow (Auto-playing)
function FeaturedSlideshow({
  featuredImages,
  autoPlay = true,
  onImageClick,
  isDarkMode,
}: {
  featuredImages: string[];
  autoPlay?: boolean;
  onImageClick: (index: number) => void;
  isDarkMode: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || featuredImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredImages.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [featuredImages.length, autoPlay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current;

    // Swipe left/right with at least 50px movement
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        setCurrentIndex(
          (prev) => (prev - 1 + featuredImages.length) % featuredImages.length
        );
      } else {
        // Swipe left - go to next
        setCurrentIndex((prev) => (prev + 1) % featuredImages.length);
      }
    }

    touchStartRef.current = null;
  };

  return (
    <div 
      className="featured-slideshow relative h-80 rounded-lg overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={featuredImages[currentIndex] || "/placeholder.svg"}
        alt="Featured view"
        width={600}
        height={400}
        className="w-full h-full object-cover transition-opacity duration-500 cursor-pointer"
        onClick={() => onImageClick(currentIndex)}
      />

      {/* Manual navigation (visible on hover) */}
      {featuredImages.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) =>
                  (prev - 1 + featuredImages.length) % featuredImages.length
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous featured image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % featuredImages.length)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next featured image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Subtle indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {featuredImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* "View All" hint */}
      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs">
        {featuredImages.length} featured • Click to view all
      </div>
    </div>
  );
}

// Section 2: Complete Image Gallery
function CompleteImageGallery({
  images,
  title,
  onImageClick,
  isDarkMode,
}: {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
  isDarkMode: boolean;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="complete-gallery">
      {/* Main viewer */}
      <div
        className={`main-viewer relative h-96 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        } rounded-lg overflow-hidden mb-4`}
      >
        <Image
          src={images[currentImage] || "/placeholder.svg"}
          alt={`${title} - ${currentImage + 1} of ${images.length}`}
          width={1200}
          height={500}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => onImageClick(currentImage)}
        />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Progress indicator */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="thumbnails flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
              currentImage === index
                ? isDarkMode
                  ? "border-amber-400 ring-2 ring-amber-400/50"
                  : "border-amber-600 ring-2 ring-amber-600/50"
                : isDarkMode
                ? "border-gray-600 hover:border-gray-400"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  const { isDarkMode } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle pull-to-close gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only capture touch at the top of the scrollable content
    if (contentRef.current) {
      const scrollTop = contentRef.current.scrollTop;
      if (scrollTop === 0) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !contentRef.current) return;

    const deltaY = e.touches[0].clientY - touchStartRef.current.y;
    const scrollTop = contentRef.current.scrollTop;

    // Only allow pull down when at top of scroll
    if (deltaY > 0 && scrollTop === 0) {
      setPullDistance(deltaY);
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${deltaY}px)`;
        containerRef.current.style.opacity = `${1 - deltaY / 400}`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;

    // Close if pulled down more than 150px
    if (pullDistance > 150) {
      onClose();
    } else if (containerRef.current) {
      containerRef.current.style.transform = 'translateY(0)';
      containerRef.current.style.opacity = '1';
    }

    setPullDistance(0);
    touchStartRef.current = null;
  };

  // Fixed height for Featured Views to ensure alignment
  const featuredViewsHeight = 320; // 320px = 80 * 4 (h-80 in Tailwind)
  // Calculate if text needs truncation based on estimated height (roughly 1500 chars fills 320px with text-base leading-relaxed)
  const shouldTruncate =
    (project.details?.length || project.description?.length || 0) > 1000;

  // Helper function to extract URL from image (string or object)
  const getImageUrl = (img: any): string => {
    if (typeof img === "string") return img;
    if (img && typeof img === "object" && img.url) return img.url;
    return "/placeholder.svg";
  };

  // Process images based on available format
  const processImages = () => {
    // Use images array with featured flag
    if (
      project.images &&
      Array.isArray(project.images) &&
      project.images.length > 0
    ) {
      const imageObjects = project.images;

      // Sort by order field if available
      const sortedImages = [...imageObjects].sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        return orderA - orderB;
      });

      // Extract featured images
      const featuredImgs = sortedImages
        .filter((img) => img.featured)
        .map((img) => getImageUrl(img));

      // Extract all images
      const allImgs = sortedImages.map((img) => getImageUrl(img));

      return {
        featured: featuredImgs.length > 0 ? featuredImgs : allImgs.slice(0, 5),
        all: allImgs,
      };
    }

    // Fallback: Use single image
    const fallbackImage = project.image || "/placeholder.svg";
    return {
      featured: [fallbackImage],
      all: [fallbackImage],
    };
  };

  const { featured: featuredImages, all: allImages } = processImages();

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setShowLightbox(true);
  };

  const openImageViewer = (index: number) => {
    setImageViewerIndex(index);
    setShowImageViewer(true);
  };

  return (
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        {/* Pull to close indicator */}
        {pullDistance > 30 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {pullDistance > 150 ? 'Release to close' : 'Pull down to close'}
          </div>
        )}

        <div
          ref={containerRef}
          className={`${
            isDarkMode
              ? "bg-gray-900 border border-gray-800"
              : "bg-gradient-to-br from-white via-orange-25 to-gray-50 border border-gray-200"
          } rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl touch-pan-y`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            touchAction: 'pan-y',
            transition: 'transform 0.3s ease, opacity 0.3s ease'
          }}
        >
          <div ref={contentRef} className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div
            className={`flex justify-between items-center p-6 border-b ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div>
              <h2
                className={`text-3xl font-light ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                {project.title}
              </h2>
              <span
                className={`inline-block ${
                  isDarkMode
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-amber-100 text-amber-800"
                } px-3 py-1 rounded-full text-sm font-medium`}
              >
                {project.category}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8 lg:items-start">
              {/* Left Column: Project Details */}
              <div className="lg:order-1">
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-6`}
                >
                  Project Details
                </h3>

                {/* Description Container - Fixed Height to Match Featured Views */}
                <div
                  className={`relative ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } text-base leading-relaxed pr-4`}
                  style={{
                    height: showFullDescription
                      ? "auto"
                      : `${featuredViewsHeight - 64}px`,
                    maxHeight: showFullDescription
                      ? "none"
                      : `${featuredViewsHeight - 64}px`,
                    overflow: showFullDescription ? "visible" : "hidden",
                    marginBottom: 0,
                  }}
                >
                  <p className="whitespace-pre-line">
                    {project.details || project.description}
                  </p>
                  {/* Gradient fade effect at bottom when collapsed */}
                  {!showFullDescription && shouldTruncate && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-24 pointer-events-none ${
                        isDarkMode
                          ? "bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"
                          : "bg-gradient-to-t from-white via-white/80 to-transparent"
                      }`}
                    />
                  )}
                </div>

                {/* Read More Button - At exactly 320px mark */}
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className={`w-full mt-4 mb-6 py-2.5 px-4 ${
                      isDarkMode
                        ? "bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white border-gray-700 hover:border-gray-600"
                        : "bg-gray-100/60 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                    } text-sm font-medium rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 shadow-sm`}
                  >
                    {showFullDescription ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Read More Details
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Right Column: Featured Views */}
              <div
                className={`lg:order-2 ${
                  showFullDescription ? "lg:sticky lg:self-start" : ""
                }`}
                style={{
                  top: showFullDescription ? "24px" : undefined,
                  maxHeight: showFullDescription
                    ? `calc(100vh - 48px)`
                    : undefined,
                }}
              >
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-6`}
                >
                  Featured Views
                </h3>
                <div
                  className={`relative rounded-lg overflow-hidden shadow-lg ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                  style={{ height: `${featuredViewsHeight}px` }}
                >
                  <FeaturedSlideshow
                    featuredImages={featuredImages}
                    autoPlay={true}
                    onImageClick={openImageViewer}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>

            {/* Client Details Section - Full Width Below Grid */}
            <div
              className={`mt-8 pt-6 border-t ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                Project Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.client && (
                  <div
                    className={`flex items-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <User
                      className={`h-5 w-5 mr-3 ${
                        isDarkMode ? "text-amber-400" : "text-amber-600"
                      }`}
                    />
                    <div>
                      <span
                        className={`text-sm font-medium block ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Client
                      </span>
                      <span className="text-sm">{project.client}</span>
                    </div>
                  </div>
                )}
                {project.year && (
                  <div
                    className={`flex items-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Calendar
                      className={`h-5 w-5 mr-3 ${
                        isDarkMode ? "text-amber-400" : "text-amber-600"
                      }`}
                    />
                    <div>
                      <span
                        className={`text-sm font-medium block ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Year
                      </span>
                      <span className="text-sm">{project.year}</span>
                    </div>
                  </div>
                )}
                {project.location && (
                  <div
                    className={`flex items-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <MapPin
                      className={`h-5 w-5 mr-3 ${
                        isDarkMode ? "text-amber-400" : "text-amber-600"
                      }`}
                    />
                    <div>
                      <span
                        className={`text-sm font-medium block ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Location
                      </span>
                      <span className="text-sm">{project.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Complete Gallery Section - Full Width Below */}
            <div
              className={`mt-10 pt-8 border-t ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏠</span>
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Complete Project Gallery
                </h3>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ({allImages.length} images)
                </span>
              </div>
              <div className="h-96">
                <CompleteImageGallery
                  images={allImages}
                  title={project.title}
                  onImageClick={openImageViewer}
                  isDarkMode={isDarkMode}
                />
              </div>
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
            {allImages.length > 1 && (
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
              src={allImages[selectedImageIndex] || "/placeholder.svg"}
              alt={`${project.title} - Image ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} / {allImages.length}
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-16">
                <div className="flex space-x-2 bg-black/50 p-2 rounded-lg">
                  {allImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-12 h-8 rounded overflow-hidden transition-all ${
                        index === selectedImageIndex
                          ? "ring-2 ring-white"
                          : "opacity-60 hover:opacity-80"
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
          images={allImages}
          initialIndex={imageViewerIndex}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  );
}

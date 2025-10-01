"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
} from "lucide-react";

export interface ImageViewerModalProps {
  images: string[];
  initialIndex: number;
  projectTitle: string;
  onClose: () => void;
}

export default function ImageViewerModal({
  images,
  initialIndex,
  projectTitle,
  onClose,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset transformations when image changes
  useEffect(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          previousImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "r":
        case "R":
          rotate();
          break;
        case "0":
          resetTransform();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.5));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = images[currentIndex];
    link.download = `${projectTitle}-image-${currentIndex + 1}.jpg`;
    link.click();
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="text-white">
          <h3 className="text-lg font-medium">{projectTitle}</h3>
          <p className="text-sm text-gray-300">
            {currentIndex + 1} of {images.length}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            className="bg-white/20 hover:bg-white/30 text-white"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            className="bg-white/20 hover:bg-white/30 text-white"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={rotate}
            className="bg-white/20 hover:bg-white/30 text-white"
            title="Rotate (R)"
          >
            <RotateCw className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-white/20 hover:bg-white/30 text-white"
            title="Fullscreen"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={downloadImage}
            className="bg-white/20 hover:bg-white/30 text-white"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white"
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={previousImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
            title="Previous (←)"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
            title="Next (→)"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Main Image Container */}
      <div
        ref={imageRef}
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
        }}
      >
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${projectTitle} - Image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="max-w-[90vw] max-h-[90vh] object-contain select-none"
            draggable={false}
            priority
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-4 bg-black/50 px-4 py-2 rounded-lg">
          {/* Zoom Level */}
          <span className="text-white text-sm font-medium">
            {Math.round(scale * 100)}%
          </span>

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTransform}
            className="text-white hover:bg-white/20 text-xs"
            title="Reset (0)"
          >
            Reset
          </Button>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex space-x-1 max-w-xs overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-12 h-8 rounded overflow-hidden transition-all flex-shrink-0 ${
                    index === currentIndex
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
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="absolute bottom-4 right-4 text-white text-xs opacity-60">
        <div>Use mouse wheel or +/- to zoom</div>
        <div>Drag to pan when zoomed</div>
        <div>Press R to rotate, 0 to reset</div>
      </div>
    </div>
  );
}

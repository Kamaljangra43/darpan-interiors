"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating: number) => {
    if (!readonly) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const currentRating = hoverRating || rating;
        const isFilled = star <= currentRating;
        const isHalfFilled =
          star > currentRating && star - 0.5 <= currentRating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } transition-all duration-200 ${
              readonly ? "" : "hover:drop-shadow-sm"
            } relative`}
          >
            {/* Background star (empty) */}
            <Star
              className={`${sizeClasses[size]} transition-colors duration-200 ${
                isFilled || isHalfFilled ? "text-amber-400" : "text-gray-300"
              } ${isFilled ? "fill-amber-400" : "fill-gray-200"}`}
            />

            {/* Half star overlay */}
            {isHalfFilled && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: "50%" }}
              >
                <Star
                  className={`${sizeClasses[size]} text-amber-400 fill-amber-400`}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

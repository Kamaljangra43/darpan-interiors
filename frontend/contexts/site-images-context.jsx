"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { siteImageService } from "@/lib/services/siteImageService";

const SiteImagesContext = createContext();

export function SiteImagesProvider({ children }) {
  const [siteImages, setSiteImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSiteImages();
  }, []);

  const fetchSiteImages = async () => {
    try {
      setLoading(true);
      const data = await siteImageService.getAllSiteImages();

      // Optimize Cloudinary URLs
      const optimizedData = data.map((img) => {
        if (img.image && typeof img.image === "object" && img.image.url) {
          const url = img.image.url;
          if (url.includes("cloudinary.com")) {
            // Optimize based on category
            let transformation = "/upload/f_auto,q_auto,";
            if (img.category === "logo") {
              transformation += "w_400,h_400,c_fit/";
            } else if (img.category === "hero") {
              transformation += "w_1920,h_1080,c_fill/";
            } else {
              transformation += "w_800,h_600,c_fill/";
            }
            img.image.url = url.replace("/upload/", transformation);
          }
        } else if (
          typeof img.image === "string" &&
          img.image.includes("cloudinary.com")
        ) {
          let transformation = "/upload/f_auto,q_auto,";
          if (img.category === "logo") {
            transformation += "w_400,h_400,c_fit/";
          } else if (img.category === "hero") {
            transformation += "w_1920,h_1080,c_fill/";
          } else {
            transformation += "w_800,h_600,c_fill/";
          }
          img.image = img.image.replace("/upload/", transformation);
        }
        return img;
      });

      console.log("✅ Site images fetched:", optimizedData);
      setSiteImages(optimizedData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch site images");
      console.error("❌ Error fetching site images:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSiteImagesByCategory = (category, section) => {
    return siteImages
      .filter(
        (img) =>
          img.category === category &&
          img.active &&
          (!section || img.section === section)
      )
      .sort((a, b) => a.order - b.order);
  };

  const addSiteImage = async (image) => {
    try {
      setLoading(true);
      console.log("📤 Adding site image:", image);
      const newImage = await siteImageService.createSiteImage(image);
      console.log("✅ Site image added:", newImage);
      setSiteImages((prev) => [...prev, newImage]);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to add site image");
      console.error("❌ Error adding site image:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSiteImage = async (id, image) => {
    try {
      setLoading(true);
      const updated = await siteImageService.updateSiteImage(id, image);
      setSiteImages((prev) =>
        prev.map((img) => (img._id === id ? updated : img))
      );
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update site image");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSiteImage = async (id) => {
    try {
      setLoading(true);
      console.log("🗑️ Deleting site image:", id);
      await siteImageService.deleteSiteImage(id);
      setSiteImages((prev) => prev.filter((img) => img._id !== id));
      setError(null);
      console.log("✅ Site image deleted successfully");
    } catch (err) {
      setError(err.message || "Failed to delete site image");
      console.error("❌ Error deleting site image:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteImagesContext.Provider
      value={{
        siteImages,
        getSiteImagesByCategory,
        addSiteImage,
        updateSiteImage,
        deleteSiteImage,
        loading,
        error,
      }}
    >
      {children}
    </SiteImagesContext.Provider>
  );
}

export function useSiteImages() {
  const context = useContext(SiteImagesContext);
  if (!context) {
    throw new Error("useSiteImages must be used within SiteImagesProvider");
  }
  return context;
}

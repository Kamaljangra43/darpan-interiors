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
      console.log("✅ Site images fetched:", data);
      setSiteImages(data);
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

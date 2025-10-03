"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { aboutService } from "@/lib/services/aboutService";
import { imageService } from "@/lib/services/imageService";

interface About {
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  mission?: string;
  vision?: string;
  values?: string[];
  featuredImage?: {
    url: string;
    public_id: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AboutContextType {
  about: About | null;
  updateAbout: (aboutData: Partial<About>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export function AboutProvider({ children }: { children: React.ReactNode }) {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const data = await aboutService.getAbout();
      setAbout(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch about data");
      console.error("Error fetching about:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateAbout = async (aboutData: Partial<About>) => {
    try {
      setLoading(true);

      // If there's a new featured image as base64, upload it to Cloudinary
      let updatedData = { ...aboutData };
      if (
        aboutData.featuredImage &&
        typeof aboutData.featuredImage === "string"
      ) {
        const uploadResult = await imageService.uploadImage({
          image: aboutData.featuredImage as any,
          category: "about",
          section: "featured",
          alt_text: aboutData.title || "About section image",
        });
        updatedData.featuredImage = {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
        };
      }

      const updated = await aboutService.updateAbout(updatedData);
      setAbout(updated);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update about data");
      console.error("Error updating about:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AboutContext.Provider value={{ about, updateAbout, loading, error }}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout() {
  const context = useContext(AboutContext);
  if (!context) {
    throw new Error("useAbout must be used within AboutProvider");
  }
  return context;
}

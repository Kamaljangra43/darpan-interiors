"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { serviceService } from "@/lib/services/serviceService";
import { imageService } from "@/lib/services/imageService";

interface Service {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  image?: {
    url: string;
    public_id: string;
  };
  features?: string[];
  order: number;
}

interface ServicesContextType {
  services: Service[];
  addService: (service: Omit<Service, "_id">) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch services");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const addService = async (service: Omit<Service, "_id">) => {
    try {
      setLoading(true);

      // If service has an image as base64, upload it to Cloudinary
      let imageData = service.image;
      if (typeof service.image === "string") {
        const uploadResult = await imageService.uploadImage({
          image: service.image as any,
          category: "services",
          section: service.title,
        });
        imageData = {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
        };
      }

      const serviceData = {
        ...service,
        image: imageData,
      };

      const newService = await serviceService.createService(serviceData);
      setServices((prev) =>
        [...prev, newService].sort((a, b) => a.order - b.order)
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to add service");
      console.error("Error adding service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    try {
      setLoading(true);

      // If service has a new image as base64, upload it to Cloudinary
      let updatedData = { ...service };
      if (service.image && typeof service.image === "string") {
        const uploadResult = await imageService.uploadImage({
          image: service.image as any,
          category: "services",
          section: service.title || "service",
        });
        updatedData.image = {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
        };
      }

      const updated = await serviceService.updateService(id, updatedData);
      setServices((prev) =>
        prev
          .map((s) => (s._id === id ? updated : s))
          .sort((a, b) => a.order - b.order)
      );
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update service");
      console.error("Error updating service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      setLoading(true);
      await serviceService.deleteService(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete service");
      console.error("Error deleting service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        loading,
        error,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within ServicesProvider");
  }
  return context;
}

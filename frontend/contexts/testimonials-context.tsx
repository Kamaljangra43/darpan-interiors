"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { testimonialService } from "@/lib/services/testimonialService";
import type { Testimonial } from "@/types/project";

interface TestimonialsContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, "_id">) => Promise<void>;
  updateTestimonial: (
    id: string,
    updated: Partial<Testimonial>
  ) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(
  undefined
);

export function TestimonialsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAllTestimonials();
      console.log("✅ Testimonials fetched:", data);
      setTestimonials(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, "_id">) => {
    try {
      setLoading(true);
      console.log("📤 Adding testimonial:", testimonial);
      const newTestimonial = await testimonialService.createTestimonial(
        testimonial
      );
      console.log("✅ Testimonial added:", newTestimonial);
      setTestimonials((prev) => [newTestimonial, ...prev]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Error adding testimonial:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (
    id: string,
    updated: Partial<Testimonial>
  ) => {
    try {
      setLoading(true);
      const updatedTestimonial = await testimonialService.updateTestimonial(
        id,
        updated
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? updatedTestimonial : t))
      );
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      setLoading(true);
      await testimonialService.deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TestimonialsContext.Provider
      value={{
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        loading,
        error,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const context = useContext(TestimonialsContext);
  if (!context) {
    throw new Error("useTestimonials must be used within TestimonialsProvider");
  }
  return context;
}

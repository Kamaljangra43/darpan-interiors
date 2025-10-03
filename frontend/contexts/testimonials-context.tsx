"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { testimonialService } from "@/lib/services/testimonialService";

interface Testimonial {
  _id?: string;
  name: string;
  content: string;
  rating: number;
  image?: {
    url: string;
    public_id: string;
  };
  featured?: boolean;
}

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
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, "_id">) => {
    try {
      setLoading(true);
      const newTestimonial = await testimonialService.createTestimonial(
        testimonial
      );
      setTestimonials((prev) => [newTestimonial, ...prev]);
    } catch (err: any) {
      setError(err.message);
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

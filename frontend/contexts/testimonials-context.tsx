"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  project: string
  createdAt: Date
}

interface TestimonialsContextType {
  testimonials: Testimonial[]
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt">) => void
  updateTestimonial: (id: number, updatedTestimonial: Partial<Omit<Testimonial, "id" | "createdAt">>) => void
  deleteTestimonial: (id: number) => void
  loading: boolean
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined)

export function TestimonialsProvider({ children }: { children: ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load testimonials from localStorage
    const savedTestimonials = localStorage.getItem("darpan_testimonials")
    if (savedTestimonials) {
      const parsedTestimonials = JSON.parse(savedTestimonials).map((testimonial: any) => ({
        ...testimonial,
        createdAt: new Date(testimonial.createdAt),
      }))
      setTestimonials(parsedTestimonials)
    } else {
      // Default testimonials
      const defaultTestimonials: Testimonial[] = [
        {
          id: 1,
          name: "Sarah Mitchell",
          role: "Homeowner, Beverly Hills",
          content:
            "Darpan Interiors transformed our dated home into a stunning modern sanctuary. Their attention to detail and ability to understand our vision was exceptional. Every room feels perfectly curated.",
          rating: 5,
          project: "Whole Home Renovation",
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "David Chen",
          role: "CEO, TechFlow Solutions",
          content:
            "Our new headquarters reflects our company culture perfectly. The team created a space that's both professional and inspiring. Employee satisfaction has increased significantly since the redesign.",
          rating: 5,
          project: "Corporate Office Design",
          createdAt: new Date(),
        },
        {
          id: 3,
          name: "Maria Rodriguez",
          role: "Restaurant Owner",
          content:
            "The restaurant design exceeded all expectations. The ambiance is exactly what we envisioned, and our customers constantly compliment the beautiful interior. It's become a destination in itself.",
          rating: 5,
          project: "Restaurant Interior",
          createdAt: new Date(),
        },
      ]
      setTestimonials(defaultTestimonials)
      localStorage.setItem("darpan_testimonials", JSON.stringify(defaultTestimonials))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "darpan_testimonials") {
        const savedTestimonials = localStorage.getItem("darpan_testimonials")
        if (savedTestimonials) {
          const parsedTestimonials = JSON.parse(savedTestimonials).map((testimonial: any) => ({
            ...testimonial,
            createdAt: new Date(testimonial.createdAt),
          }))
          setTestimonials(parsedTestimonials)
        }
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleTestimonialsUpdate = () => {
      const savedTestimonials = localStorage.getItem("darpan_testimonials")
      if (savedTestimonials) {
        const parsedTestimonials = JSON.parse(savedTestimonials).map((testimonial: any) => ({
          ...testimonial,
          createdAt: new Date(testimonial.createdAt),
        }))
        setTestimonials(parsedTestimonials)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("darpan-testimonials-updated", handleTestimonialsUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("darpan-testimonials-updated", handleTestimonialsUpdate)
    }
  }, [])

  const addTestimonial = (newTestimonial: Omit<Testimonial, "id" | "createdAt">) => {
    const testimonial: Testimonial = {
      ...newTestimonial,
      id: Date.now(),
      createdAt: new Date(),
    }
    const updatedTestimonials = [testimonial, ...testimonials]
    setTestimonials(updatedTestimonials)
    localStorage.setItem("darpan_testimonials", JSON.stringify(updatedTestimonials))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("darpan-testimonials-updated"))
    }, 0)
  }

  const updateTestimonial = (id: number, updatedTestimonial: Partial<Omit<Testimonial, "id" | "createdAt">>) => {
    const updatedTestimonials = testimonials.map((testimonial) =>
      testimonial.id === id ? { ...testimonial, ...updatedTestimonial } : testimonial,
    )
    setTestimonials(updatedTestimonials)
    localStorage.setItem("darpan_testimonials", JSON.stringify(updatedTestimonials))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("darpan-testimonials-updated"))
    }, 0)
  }

  const deleteTestimonial = (id: number) => {
    const updatedTestimonials = testimonials.filter((testimonial) => testimonial.id !== id)
    setTestimonials(updatedTestimonials)
    localStorage.setItem("darpan_testimonials", JSON.stringify(updatedTestimonials))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("darpan-testimonials-updated"))
    }, 0)
  }

  return (
    <TestimonialsContext.Provider
      value={{ testimonials, addTestimonial, updateTestimonial, deleteTestimonial, loading }}
    >
      {children}
    </TestimonialsContext.Provider>
  )
}

export function useTestimonials() {
  const context = useContext(TestimonialsContext)
  if (context === undefined) {
    throw new Error("useTestimonials must be used within a TestimonialsProvider")
  }
  return context
}

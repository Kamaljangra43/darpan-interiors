"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Project } from "../types/project"

interface ProjectsContextType {
  projects: Project[]
  loading: boolean
  addProject: (project: Omit<Project, "id" | "createdAt">) => void
  updateProject: (id: number, updates: Partial<Project>) => void
  deleteProject: (id: number) => void
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize with sample projects
    const sampleProjects: Project[] = [
      {
        id: 1,
        title: "Modern Luxury Living Room",
        category: "residential",
        image: "/modern-luxury-living-room-interior-design.jpg",
        images: [
          "/modern-luxury-living-room-interior-design.jpg",
          "/elegant-bedroom-interior-design.jpg",
          "/modern-kitchen.png",
        ],
        description: "A stunning modern living room with contemporary furniture and elegant lighting solutions.",
        details:
          "This project transformed a traditional living space into a modern luxury retreat with carefully selected furniture, ambient lighting, and a sophisticated color palette.",
        client: "Johnson Family",
        year: "2024",
        location: "Beverly Hills, CA",
        duration: "3 months",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: 2,
        title: "Elegant Bedroom Suite",
        category: "residential",
        image: "/elegant-bedroom-interior-design.jpg",
        images: ["/elegant-bedroom-interior-design.jpg", "/luxury-bathroom-interior.jpg", "/cozy-living-room.png"],
        description: "A serene bedroom design featuring plush textiles and calming neutral tones.",
        details:
          "Created a peaceful sanctuary with custom upholstered headboard, layered lighting, and luxurious fabrics that promote rest and relaxation.",
        client: "Private Residence",
        year: "2024",
        location: "Malibu, CA",
        duration: "2 months",
        createdAt: new Date("2024-02-10"),
      },
      {
        id: 3,
        title: "Contemporary Kitchen Remodel",
        category: "residential",
        image: "/modern-kitchen.png",
        images: ["/modern-kitchen.png", "/cozy-living-room.png", "/luxury-bathroom-interior.jpg"],
        description: "A sleek, functional kitchen with state-of-the-art appliances and custom cabinetry.",
        details:
          "Complete kitchen renovation featuring custom Italian cabinetry, marble countertops, and professional-grade appliances for the aspiring chef.",
        client: "Chen Family",
        year: "2023",
        location: "West Hollywood, CA",
        duration: "4 months",
        createdAt: new Date("2023-11-20"),
      },
      {
        id: 4,
        title: "Spa-Inspired Bathroom",
        category: "residential",
        image: "/luxury-bathroom-interior.jpg",
        images: [
          "/luxury-bathroom-interior.jpg",
          "/modern-luxury-living-room-interior-design.jpg",
          "/elegant-bedroom-interior-design.jpg",
        ],
        description: "A luxurious bathroom retreat with natural stone and premium fixtures.",
        details:
          "Transformed a standard bathroom into a spa-like oasis featuring heated floors, rainfall shower, soaking tub, and natural stone finishes.",
        client: "Rodriguez Family",
        year: "2023",
        location: "Santa Monica, CA",
        duration: "2.5 months",
        createdAt: new Date("2023-12-05"),
      },
      {
        id: 5,
        title: "Cozy Living Space",
        category: "residential",
        image: "/cozy-living-room.png",
        images: ["/cozy-living-room.png", "/modern-kitchen.png", "/elegant-bedroom-interior-design.jpg"],
        description: "A warm and inviting living room perfect for family gatherings.",
        details:
          "Designed a comfortable family space with layered seating, warm lighting, and versatile layout that accommodates both entertaining and everyday living.",
        client: "Thompson Family",
        year: "2024",
        location: "Pasadena, CA",
        duration: "6 weeks",
        createdAt: new Date("2024-03-01"),
      },
      {
        id: 6,
        title: "Executive Office Suite",
        category: "commercial",
        image: "/modern-luxury-living-room-interior-design.jpg",
        images: ["/modern-luxury-living-room-interior-design.jpg", "/modern-kitchen.png", "/cozy-living-room.png"],
        description: "A sophisticated office space designed for productivity and style.",
        details:
          "Created a professional workspace with ergonomic furniture, integrated technology, and acoustic solutions for maximum productivity.",
        client: "Tech Startup Inc.",
        year: "2023",
        location: "Downtown LA",
        duration: "5 months",
        createdAt: new Date("2023-10-15"),
      },
    ]

    setProjects(sampleProjects)
    setLoading(false)
  }, [])

  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = {
      ...project,
      id: Math.max(...projects.map((p) => p.id), 0) + 1,
      createdAt: new Date(),
    }
    setProjects([...projects, newProject])
  }

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, ...updates } : project)))
  }

  const deleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}

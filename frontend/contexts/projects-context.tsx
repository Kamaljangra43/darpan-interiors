"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Project {
  id: number
  title: string
  category: string
  image: string
  images?: string[] // Add array of additional images
  description?: string
  details?: string // Add detailed description
  client?: string // Add client name
  year?: string // Add project year
  location?: string // Add project location
  createdAt: Date
}

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "createdAt">) => void
  updateProject: (id: number, updatedProject: Partial<Omit<Project, "id" | "createdAt">>) => void
  deleteProject: (id: number) => void
  loading: boolean
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem("darpan_projects")
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects).map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
      }))
      setProjects(parsedProjects)
    } else {
      // Default interior design projects
      const defaultProjects: Project[] = [
        {
          id: 1,
          title: "Luxury Living Room Makeover",
          category: "Residential",
          image:
            "/placeholder.svg?height=400&width=600&text=Luxury+Living+Room+with+Velvet+Sofa+and+Marble+Coffee+Table",
          images: [
            "/placeholder.svg?height=600&width=800&text=Luxury+Living+Room+Main+View+with+Chandelier",
            "/placeholder.svg?height=600&width=800&text=Living+Room+Side+Angle+with+Bookshelf",
            "/placeholder.svg?height=600&width=800&text=Living+Room+Fireplace+Area+with+Artwork",
            "/placeholder.svg?height=600&width=800&text=Living+Room+Window+View+with+Curtains",
          ],
          description: "Elegant living space with contemporary luxury finishes",
          details:
            "This stunning living room transformation features a sophisticated palette of cream, gold, and deep navy. Custom velvet furniture, Italian marble accents, and carefully curated artwork create an atmosphere of refined luxury. The space includes bespoke lighting solutions, handcrafted furniture pieces, and premium textiles that elevate the entire aesthetic.",
          client: "The Morrison Family",
          year: "2024",
          location: "Beverly Hills, CA",
          createdAt: new Date(),
        },
        {
          id: 2,
          title: "Modern Corporate Headquarters",
          category: "Commercial",
          image: "/placeholder.svg?height=400&width=600&text=Modern+Office+Reception+with+Glass+and+Steel",
          images: [
            "/placeholder.svg?height=600&width=800&text=Corporate+Reception+Lobby+with+Logo",
            "/placeholder.svg?height=600&width=800&text=Open+Office+Space+with+Modern+Desks",
            "/placeholder.svg?height=600&width=800&text=Executive+Conference+Room+with+City+View",
          ],
          description: "Sleek corporate environment promoting productivity and collaboration",
          details:
            "A cutting-edge office design that balances functionality with aesthetic appeal. Features include open collaborative spaces, private meeting pods, biophilic design elements, and state-of-the-art technology integration. The design promotes employee wellbeing through natural lighting, ergonomic furniture, and flexible work zones.",
          client: "TechFlow Solutions",
          year: "2023",
          location: "Downtown Los Angeles",
          createdAt: new Date(),
        },
        {
          id: 3,
          title: "Serene Master Bedroom Suite",
          category: "Residential",
          image: "/placeholder.svg?height=400&width=600&text=Master+Bedroom+with+Tufted+Headboard+and+Soft+Lighting",
          images: [
            "/placeholder.svg?height=600&width=800&text=Master+Bedroom+Main+View+with+King+Bed",
            "/placeholder.svg?height=600&width=800&text=Bedroom+Sitting+Area+with+Armchair",
            "/placeholder.svg?height=600&width=800&text=Walk-in+Closet+with+Custom+Storage",
            "/placeholder.svg?height=600&width=800&text=Master+Bathroom+with+Marble+Vanity",
            "/placeholder.svg?height=600&width=800&text=Bedroom+Balcony+with+City+Views",
          ],
          description: "Tranquil retreat with spa-like ambiance and custom furnishings",
          details:
            "This master suite embodies tranquility and luxury with its soft color palette of whites, creams, and muted golds. Features include a custom tufted headboard, premium linens, ambient lighting design, and a private sitting area. The adjoining bathroom showcases marble finishes and a freestanding soaking tub.",
          client: "Private Residence",
          year: "2024",
          location: "Malibu, CA",
          createdAt: new Date(),
        },
        {
          id: 4,
          title: "Upscale Restaurant Interior",
          category: "Commercial",
          image:
            "/placeholder.svg?height=400&width=600&text=Restaurant+Dining+Room+with+Warm+Lighting+and+Booth+Seating",
          images: [
            "/placeholder.svg?height=600&width=800&text=Restaurant+Main+Dining+Area+with+Tables",
            "/placeholder.svg?height=600&width=800&text=Restaurant+Bar+Area+with+Pendant+Lights",
            "/placeholder.svg?height=600&width=800&text=Private+Dining+Room+with+Wine+Display",
          ],
          description: "Sophisticated dining atmosphere with warm, inviting ambiance",
          details:
            "An upscale restaurant design that creates an intimate dining experience through strategic lighting, rich materials, and thoughtful space planning. Features include custom banquette seating, artisanal lighting fixtures, and a carefully curated color scheme that enhances the culinary experience.",
          client: "Bella Vista Restaurant",
          year: "2023",
          location: "West Hollywood, CA",
          createdAt: new Date(),
        },
        {
          id: 5,
          title: "Gourmet Kitchen Renovation",
          category: "Residential",
          image: "/placeholder.svg?height=400&width=600&text=Modern+Kitchen+with+Marble+Island+and+Brass+Fixtures",
          images: [
            "/placeholder.svg?height=600&width=800&text=Kitchen+Island+with+Bar+Stools+and+Pendant+Lights",
            "/placeholder.svg?height=600&width=800&text=Kitchen+Cabinets+with+Integrated+Appliances",
            "/placeholder.svg?height=600&width=800&text=Kitchen+Pantry+with+Custom+Storage",
            "/placeholder.svg?height=600&width=800&text=Kitchen+Breakfast+Nook+with+Built-in+Seating",
          ],
          description: "Chef-inspired kitchen with premium appliances and custom cabinetry",
          details:
            "A gourmet kitchen designed for both functionality and entertaining. Features Calacatta marble countertops, custom cabinetry with soft-close mechanisms, professional-grade appliances, and a spacious island with integrated seating. Brass fixtures and warm wood tones add elegance to the space.",
          client: "The Chen Family",
          year: "2024",
          location: "Manhattan Beach, CA",
          createdAt: new Date(),
        },
        {
          id: 6,
          title: "Boutique Hotel Lobby",
          category: "Commercial",
          image: "/placeholder.svg?height=400&width=600&text=Hotel+Lobby+with+Marble+Reception+and+Velvet+Seating",
          images: [
            "/placeholder.svg?height=600&width=800&text=Hotel+Reception+Desk+with+Backlit+Marble",
            "/placeholder.svg?height=600&width=800&text=Lobby+Lounge+Area+with+Designer+Furniture",
            "/placeholder.svg?height=600&width=800&text=Hotel+Elevator+Bank+with+Artistic+Panels",
          ],
          description: "Luxurious hospitality space with contemporary elegance",
          details:
            "A boutique hotel lobby that creates a memorable first impression through sophisticated design elements. Features include a dramatic marble reception desk, curated art installations, plush seating areas, and ambient lighting that creates a warm, welcoming atmosphere for guests.",
          client: "The Meridian Hotel",
          year: "2023",
          location: "Santa Monica, CA",
          createdAt: new Date(),
        },
        {
          id: 7,
          title: "Minimalist Home Office",
          category: "Residential",
          image: "/placeholder.svg?height=400&width=600&text=Clean+Home+Office+with+Built-in+Desk+and+Shelving",
          images: [
            "/placeholder.svg?height=600&width=800&text=Home+Office+Desk+Area+with+Task+Lighting",
            "/placeholder.svg?height=600&width=800&text=Office+Built-in+Storage+with+Books",
            "/placeholder.svg?height=600&width=800&text=Office+Reading+Corner+with+Armchair",
          ],
          description: "Clean, functional workspace promoting focus and creativity",
          details:
            "A minimalist home office designed for maximum productivity and minimal distractions. Features built-in storage solutions, ergonomic furniture, natural lighting optimization, and a calming color palette. The space includes a dedicated reading corner and integrated technology solutions.",
          client: "Creative Professional",
          year: "2024",
          location: "Venice, CA",
          createdAt: new Date(),
        },
        {
          id: 8,
          title: "Spa-Inspired Bathroom",
          category: "Residential",
          image: "/placeholder.svg?height=400&width=600&text=Luxury+Bathroom+with+Freestanding+Tub+and+Natural+Stone",
          images: [
            "/placeholder.svg?height=600&width=800&text=Bathroom+Freestanding+Tub+with+Window+View",
            "/placeholder.svg?height=600&width=800&text=Double+Vanity+with+Marble+Countertops",
            "/placeholder.svg?height=600&width=800&text=Walk-in+Shower+with+Rain+Head",
            "/placeholder.svg?height=600&width=800&text=Bathroom+Storage+Niche+with+Towels",
          ],
          description: "Luxurious bathroom retreat with natural materials and serene ambiance",
          details:
            "A spa-inspired bathroom that serves as a personal sanctuary. Features include a freestanding soaking tub, walk-in rain shower, heated floors, and natural stone finishes. The design emphasizes relaxation through soft lighting, organic textures, and a neutral color palette.",
          client: "Wellness Enthusiast",
          year: "2024",
          location: "Pasadena, CA",
          createdAt: new Date(),
        },
      ]
      setProjects(defaultProjects)
    }
    setLoading(false)
  }, [])

  const addProject = (newProject: Omit<Project, "id" | "createdAt">) => {
    const project: Project = {
      ...newProject,
      id: Date.now(),
      createdAt: new Date(),
    }
    const updatedProjects = [project, ...projects]
    setProjects(updatedProjects)
    localStorage.setItem("darpan_projects", JSON.stringify(updatedProjects))
  }

  const updateProject = (id: number, updatedProject: Partial<Omit<Project, "id" | "createdAt">>) => {
    const updatedProjects = projects.map((project) => (project.id === id ? { ...project, ...updatedProject } : project))
    setProjects(updatedProjects)
    localStorage.setItem("darpan_projects", JSON.stringify(updatedProjects))
  }

  const deleteProject = (id: number) => {
    const updatedProjects = projects.filter((project) => project.id !== id)
    setProjects(updatedProjects)
    localStorage.setItem("darpan_projects", JSON.stringify(updatedProjects))
  }

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject, loading }}>
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

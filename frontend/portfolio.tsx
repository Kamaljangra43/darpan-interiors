"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Star,
  Menu,
  X,
  Settings,
  Calendar,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  MessageSquare,
  Eye,
  Clock,
  Palette,
  Lightbulb,
  Ruler,
  Sofa,
  Building,
  Sparkles,
  Quote,
  Search,
  Grid,
  List,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react"
import { useTheme, ThemeProvider } from "./contexts/theme-context"
import { AuthProvider, useAuth } from "./contexts/auth-context"
import { ProjectsProvider, useProjects } from "./contexts/projects-context"
import { TestimonialsProvider, useTestimonials } from "./contexts/testimonials-context"
import AdminLogin from "./components/admin-login"
import AdminDashboard from "./components/admin-dashboard"
import AdminAccess from "./components/admin-access"
import SettingsModal from "./components/settings-modal"
import ConsultationModal from "./components/consultation-modal"
import ProjectDetailModal from "./components/project-detail-modal"
import ImageViewerModal from "./components/image-viewer-modal"
import type { Project } from "./types/project"

function DarpanInteriorsPortfolioContent() {
  const { isDarkMode } = useTheme()
  const { isAuthenticated, logout } = useAuth()
  const { projects, loading: projectsLoading } = useProjects()
  const { testimonials, loading: testimonialsLoading } = useTestimonials()
  const { showAdminLogin, setShowAdminLogin } = AdminAccess()

  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showConsultation, setShowConsultation] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [visibleProjects, setVisibleProjects] = useState(6)
  const [projectFilter, setProjectFilter] = useState("all")
  const [projectSearch, setProjectSearch] = useState("")
  const [projectViewMode, setProjectViewMode] = useState<"grid" | "list">("grid")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isTestimonialPlaying, setIsTestimonialPlaying] = useState(true)

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isTestimonialPlaying || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length, isTestimonialPlaying])

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesFilter = projectFilter === "all" || project.category === projectFilter
    const matchesSearch =
      projectSearch === "" ||
      project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      project.description.toLowerCase().includes(projectSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const displayedProjects = filteredProjects.slice(0, visibleProjects)

  // Get unique categories for filter
  const categories = ["all", ...Array.from(new Set(projects.map((p) => p.category)))]

  const services = [
    {
      icon: Home,
      title: "Residential Design",
      description: "Complete home makeovers with personalized touches",
      features: ["Space Planning", "Color Consultation", "Furniture Selection", "Lighting Design"],
    },
    {
      icon: Building,
      title: "Commercial Spaces",
      description: "Professional environments that inspire productivity",
      features: ["Office Design", "Retail Spaces", "Restaurant Interiors", "Hotel Design"],
    },
    {
      icon: Palette,
      title: "Color Consultation",
      description: "Expert color schemes that transform your space",
      features: ["Color Psychology", "Paint Selection", "Accent Colors", "Seasonal Updates"],
    },
    {
      icon: Lightbulb,
      title: "Lighting Design",
      description: "Illumination solutions for every mood and function",
      features: ["Ambient Lighting", "Task Lighting", "Accent Lighting", "Smart Controls"],
    },
    {
      icon: Ruler,
      title: "Space Planning",
      description: "Optimize your space for maximum functionality",
      features: ["Layout Design", "Traffic Flow", "Storage Solutions", "Multi-Purpose Areas"],
    },
    {
      icon: Sofa,
      title: "Furniture Selection",
      description: "Curated pieces that reflect your personal style",
      features: ["Custom Furniture", "Vintage Finds", "Modern Pieces", "Sustainable Options"],
    },
  ]

  const stats = [
    { icon: Users, label: "Happy Clients", value: "150+", description: "Satisfied customers worldwide" },
    { icon: Award, label: "Years Experience", value: "12+", description: "In interior design industry" },
    { icon: Briefcase, label: "Projects Completed", value: "200+", description: "Successful transformations" },
    { icon: TrendingUp, label: "Client Satisfaction", value: "98%", description: "Positive feedback rate" },
  ]

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: Eye },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "contact", label: "Contact", icon: Mail },
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Admin Panel - Only show if authenticated */}
      {isAuthenticated && <AdminDashboard />}

      {/* Admin Login Modal - No longer triggered by URL parameters */}
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onAdminLogin={() => {
            setShowSettings(false)
            setShowAdminLogin(true)
          }}
          isAdmin={isAuthenticated}
        />
      )}

      {/* Consultation Modal */}
      {showConsultation && <ConsultationModal onClose={() => setShowConsultation(false)} />}

      {/* Project Detail Modal */}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      {/* Image Viewer Modal */}
      {selectedImage && <ImageViewerModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}

      {/* Navigation Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 ${
          isDarkMode
            ? "bg-gray-900/95 backdrop-blur-md border-gray-800"
            : "bg-white/95 backdrop-blur-md border-gray-200"
        } border-b transition-all duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-gradient-to-br from-amber-500 to-orange-600"
                } rounded-lg flex items-center justify-center`}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Darpan Interiors</h1>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Transforming Spaces</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? isDarkMode
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-amber-500/20 text-amber-600"
                        : isDarkMode
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowConsultation(true)}
                className={`hidden sm:flex ${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                } text-white`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Consultation
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                <Settings className={`h-5 w-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
              </Button>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X className={`h-5 w-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                ) : (
                  <Menu className={`h-5 w-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              className={`md:hidden border-t ${
                isDarkMode ? "border-gray-800 bg-gray-900/95" : "border-gray-200 bg-white/95"
              } backdrop-blur-md`}
            >
              <nav className="py-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? isDarkMode
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-amber-500/20 text-amber-600"
                          : isDarkMode
                            ? "text-gray-300 hover:text-white hover:bg-gray-800"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => {
                      setShowConsultation(true)
                      setIsMenuOpen(false)
                    }}
                    className={`w-full ${
                      isDarkMode
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    } text-white`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className={`${
                    isDarkMode
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : "bg-amber-500/20 text-amber-600 border-amber-500/30"
                  } border`}
                >
                  ✨ Award-Winning Interior Design
                </Badge>
                <h1
                  className={`text-4xl md:text-6xl font-bold leading-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Transforming{" "}
                  <span
                    className={`${
                      isDarkMode
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-600"
                    } bg-clip-text text-transparent`}
                  >
                    Spaces
                  </span>
                  , Creating Dreams
                </h1>
                <p className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-2xl`}>
                  With over 12 years of experience, we specialize in creating beautiful, functional spaces that reflect
                  your unique personality and lifestyle. From concept to completion, we bring your vision to life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => scrollToSection("portfolio")}
                  size="lg"
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  } text-white`}
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Our Work
                </Button>
                <Button
                  onClick={() => setShowConsultation(true)}
                  variant="outline"
                  size="lg"
                  className={`${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Free Consultation
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div
                        className={`w-12 h-12 ${
                          isDarkMode
                            ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                            : "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                        } rounded-lg flex items-center justify-center mx-auto mb-3`}
                      >
                        <Icon className={`h-6 w-6 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                      </div>
                      <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {stat.value}
                      </div>
                      <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/modern-luxury-living-room-interior-design.jpg"
                  alt="Modern luxury living room interior design"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  onClick={() => setSelectedImage("/modern-luxury-living-room-interior-design.jpg")}
                />
              </div>
              <div
                className={`absolute -top-4 -right-4 w-full h-full ${
                  isDarkMode
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                    : "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                } rounded-2xl -z-10`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className={`${
                    isDarkMode
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : "bg-amber-500/20 text-amber-600 border-amber-500/30"
                  } border`}
                >
                  About Darpan Interiors
                </Badge>
                <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Passionate About Creating{" "}
                  <span
                    className={`${
                      isDarkMode
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-600"
                    } bg-clip-text text-transparent`}
                  >
                    Beautiful Spaces
                  </span>
                </h2>
                <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Founded with a vision to transform ordinary spaces into extraordinary experiences, Darpan Interiors
                  has been at the forefront of innovative interior design for over a decade.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    } rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}
                  >
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Personalized Design Approach
                    </h3>
                    <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Every project is unique, and we tailor our designs to reflect your personal style, needs, and
                      budget.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    } rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}
                  >
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Sustainable & Eco-Friendly
                    </h3>
                    <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      We prioritize sustainable materials and eco-friendly practices in all our design solutions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-amber-500 to-orange-500"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    } rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}
                  >
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      End-to-End Service
                    </h3>
                    <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      From initial consultation to final installation, we handle every aspect of your interior design
                      project.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => scrollToSection("contact")}
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                } text-white`}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Let's Work Together
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/elegant-bedroom-interior-design.jpg"
                  alt="Elegant bedroom interior"
                  className="rounded-xl shadow-lg w-full h-auto cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage("/elegant-bedroom-interior-design.jpg")}
                />
                <img
                  src="/modern-kitchen.png"
                  alt="Modern kitchen design"
                  className="rounded-xl shadow-lg w-full h-auto cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage("/modern-kitchen.png")}
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="/luxury-bathroom-interior.jpg"
                  alt="Luxury bathroom interior"
                  className="rounded-xl shadow-lg w-full h-auto cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage("/luxury-bathroom-interior.jpg")}
                />
                <img
                  src="/cozy-living-room.png"
                  alt="Cozy living room design"
                  className="rounded-xl shadow-lg w-full h-auto cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage("/cozy-living-room.png")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-amber-500/20 text-amber-600 border-amber-500/30"
              } border`}
            >
              Our Services
            </Badge>
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Comprehensive{" "}
              <span
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-600"
                } bg-clip-text text-transparent`}
              >
                Design Solutions
              </span>
            </h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              From residential homes to commercial spaces, we offer a full range of interior design services tailored to
              your specific needs and vision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card
                  key={index}
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-amber-500/50"
                      : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-amber-500/50"
                  } transition-all duration-300 hover:shadow-xl group`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 ${
                          isDarkMode
                            ? "bg-gradient-to-br from-amber-500 to-orange-500"
                            : "bg-gradient-to-br from-amber-500 to-orange-600"
                        } rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {service.title}
                        </h3>
                        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-2`}>
                          {service.description}
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className={`flex items-center space-x-2 text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <CheckCircle
                              className={`h-4 w-4 ${isDarkMode ? "text-amber-400" : "text-amber-600"} flex-shrink-0`}
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => setShowConsultation(true)}
              size="lg"
              className={`${
                isDarkMode
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              } text-white`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className={`py-20 ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-amber-500/20 text-amber-600 border-amber-500/30"
              } border`}
            >
              Our Portfolio
            </Badge>
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Recent{" "}
              <span
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-600"
                } bg-clip-text text-transparent`}
              >
                Projects
              </span>
            </h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              Explore our latest interior design projects and see how we transform spaces into beautiful, functional
              environments.
            </p>
          </div>

          {/* Portfolio Filters and Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={projectFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProjectFilter(category)}
                  className={
                    projectFilter === category
                      ? isDarkMode
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                        : "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                      : isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <Input
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className={`pl-10 w-64 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={projectViewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProjectViewMode("grid")}
                  className={
                    projectViewMode === "grid"
                      ? isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                      : isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={projectViewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProjectViewMode("list")}
                  className={
                    projectViewMode === "list"
                      ? isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-900"
                      : isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {projectsLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
              <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Loading projects...</p>
            </div>
          )}

          {/* Projects Grid/List */}
          {!projectsLoading && (
            <>
              {projectViewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedProjects.map((project) => (
                    <Card
                      key={project.id}
                      className={`${
                        isDarkMode
                          ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-amber-500/50"
                          : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-amber-500/50"
                      } transition-all duration-300 hover:shadow-xl group cursor-pointer`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={project.images[0] || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge
                            className={`${
                              isDarkMode ? "bg-gray-900/80 text-gray-100" : "bg-white/80 text-gray-900"
                            } backdrop-blur-sm`}
                          >
                            {project.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            size="icon"
                            variant="secondary"
                            className={`${
                              isDarkMode ? "bg-gray-900/80 hover:bg-gray-800/80" : "bg-white/80 hover:bg-gray-100/80"
                            } backdrop-blur-sm`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedImage(project.images[0])
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {project.title}
                          </h3>
                          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} line-clamp-2`}>
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className={`h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {project.duration}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`${
                                isDarkMode
                                  ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                  : "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                              }`}
                            >
                              View Details
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {displayedProjects.map((project) => (
                    <Card
                      key={project.id}
                      className={`${
                        isDarkMode
                          ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 hover:border-amber-500/50"
                          : "bg-gradient-to-r from-white to-gray-50 border-gray-200 hover:border-amber-500/50"
                      } transition-all duration-300 hover:shadow-xl cursor-pointer`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <img
                              src={project.images[0] || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              size="icon"
                              variant="secondary"
                              className={`absolute top-2 right-2 ${
                                isDarkMode ? "bg-gray-900/80 hover:bg-gray-800/80" : "bg-white/80 hover:bg-gray-100/80"
                              } backdrop-blur-sm`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedImage(project.images[0])
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {project.title}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className={`mt-1 ${
                                    isDarkMode ? "bg-amber-500/20 text-amber-400" : "bg-amber-500/20 text-amber-600"
                                  }`}
                                >
                                  {project.category}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`${
                                  isDarkMode
                                    ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                    : "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                                }`}
                              >
                                View Details
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{project.description}</p>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Clock className={`h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {project.duration}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Eye className={`h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  {project.images.length} images
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {visibleProjects < filteredProjects.length && (
                <div className="text-center mt-12">
                  <Button
                    onClick={() => setVisibleProjects((prev) => prev + 6)}
                    variant="outline"
                    size="lg"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Load More Projects
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* No Projects Found */}
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <div
                    className={`w-16 h-16 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-700 to-gray-800"
                        : "bg-gradient-to-br from-gray-100 to-gray-200"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Search className={`h-8 w-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
                    No projects found
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setProjectFilter("all")
                      setProjectSearch("")
                    }}
                    variant="outline"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-amber-500/20 text-amber-600 border-amber-500/30"
              } border`}
            >
              Client Testimonials
            </Badge>
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              What Our{" "}
              <span
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-600"
                } bg-clip-text text-transparent`}
              >
                Clients Say
              </span>
            </h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              Don't just take our word for it. Here's what our satisfied clients have to say about their experience
              working with Darpan Interiors.
            </p>
          </div>

          {/* Loading State */}
          {testimonialsLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
              <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Loading testimonials...</p>
            </div>
          )}

          {/* Testimonials Carousel */}
          {!testimonialsLoading && testimonials.length > 0 && (
            <div className="relative max-w-4xl mx-auto">
              <Card
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
                } shadow-xl`}
              >
                <CardContent className="p-8 md:p-12">
                  <div className="text-center space-y-6">
                    <Quote
                      className={`h-12 w-12 ${isDarkMode ? "text-amber-400" : "text-amber-600"} mx-auto opacity-50`}
                    />
                    <blockquote
                      className={`text-xl md:text-2xl font-medium leading-relaxed ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      "{testimonials[currentTestimonial]?.content}"
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={testimonials[currentTestimonial]?.avatar || "/placeholder.svg"}
                          alt={testimonials[currentTestimonial]?.name}
                        />
                        <AvatarFallback
                          className={`${
                            isDarkMode
                              ? "bg-gradient-to-br from-amber-500 to-orange-500"
                              : "bg-gradient-to-br from-amber-500 to-orange-600"
                          } text-white text-lg font-semibold`}
                        >
                          {testimonials[currentTestimonial]?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {testimonials[currentTestimonial]?.name}
                        </div>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {testimonials[currentTestimonial]?.role}
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (testimonials[currentTestimonial]?.rating || 0)
                                  ? isDarkMode
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-amber-500 fill-amber-500"
                                  : isDarkMode
                                    ? "text-gray-600"
                                    : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial Controls */}
              <div className="flex items-center justify-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className={`${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsTestimonialPlaying(!isTestimonialPlaying)}
                  className={`${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isTestimonialPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className={`${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex items-center justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial
                        ? isDarkMode
                          ? "bg-amber-400 w-8"
                          : "bg-amber-600 w-8"
                        : isDarkMode
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Testimonials */}
          {!testimonialsLoading && testimonials.length === 0 && (
            <div className="text-center py-12">
              <div
                className={`w-16 h-16 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-700 to-gray-800"
                    : "bg-gradient-to-br from-gray-100 to-gray-200"
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <MessageSquare className={`h-8 w-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
                No testimonials yet
              </h3>
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Client testimonials will appear here once they're added.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-amber-500/20 text-amber-600 border-amber-500/30"
              } border`}
            >
              Get In Touch
            </Badge>
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Let's Create Something{" "}
              <span
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-600"
                } bg-clip-text text-transparent`}
              >
                Beautiful Together
              </span>
            </h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}>
              Ready to transform your space? Get in touch with us today for a free consultation and let's discuss how we
              can bring your vision to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card
              className={`${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                  : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
              } shadow-xl`}
            >
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className={`${
                          isDarkMode
                            ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-500"
                            : "bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500"
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className={`${
                          isDarkMode
                            ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-500"
                            : "bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={`${
                        isDarkMode
                          ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-500"
                          : "bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className={`${
                        isDarkMode
                          ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-500"
                          : "bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Interior Design Consultation"
                      className={`${
                        isDarkMode
                          ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-500"
                          : "bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project and vision..."
                      rows={5}
                      className={`${
                        isDarkMode
                          ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-500"
                          : "bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500"
                      }`}
                    />
                  </div>

                  <Button
                    type="submit"
                    className={`w-full ${
                      isDarkMode
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    } text-white`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}>
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : "bg-gradient-to-br from-amber-500 to-orange-600"
                      } rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Email</h4>
                      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>info@darpaninteriors.com</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : "bg-gradient-to-br from-amber-500 to-orange-600"
                      } rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Phone</h4>
                      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>+1 (555) 123-4567</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Mon-Fri 9AM-6PM PST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : "bg-gradient-to-br from-amber-500 to-orange-600"
                      } rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Office</h4>
                      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        123 Design Street
                        <br />
                        Beverly Hills, CA 90210
                      </p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>By appointment only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>Follow Us</h4>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Button
                  onClick={() => setShowConsultation(true)}
                  className={`w-full ${
                    isDarkMode
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  } text-white`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Free Consultation
                </Button>
                <Button
                  onClick={() => scrollToSection("portfolio")}
                  variant="outline"
                  className={`w-full ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Our Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200"} border-t`}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                      : "bg-gradient-to-br from-amber-500 to-orange-600"
                  } rounded-lg flex items-center justify-center`}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Darpan Interiors
                  </h3>
                </div>
              </div>
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                Transforming spaces and creating beautiful, functional environments that reflect your unique style and
                personality.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Quick Links</h4>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                      } transition-colors`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Services</h4>
              <ul className="space-y-2">
                <li>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Residential Design
                  </span>
                </li>
                <li>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Commercial Spaces</span>
                </li>
                <li>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Color Consultation
                  </span>
                </li>
                <li>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Space Planning</span>
                </li>
                <li>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Furniture Selection
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Contact</h4>
              <div className="space-y-2">
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  123 Design Street
                  <br />
                  Beverly Hills, CA 90210
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>+1 (555) 123-4567</p>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>info@darpaninteriors.com</p>
              </div>
            </div>
          </div>

          <div
            className={`border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-200"
            } mt-8 pt-8 flex flex-col md:flex-row justify-between items-center`}
          >
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              © 2025 Darpan Interiors. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}
              >
                Privacy Policy
              </button>
              <button
                className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function DarpanInteriorsPortfolio() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <TestimonialsProvider>
          <ThemeProvider>
            <DarpanInteriorsPortfolioContent />
          </ThemeProvider>
        </TestimonialsProvider>
      </ProjectsProvider>
    </AuthProvider>
  )
}

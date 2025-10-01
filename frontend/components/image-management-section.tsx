"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, GripVertical, Camera, Users, Home, SettingsIcon } from "lucide-react"

interface ImageManagementProps {
  imageManagement: {
    hero: string[]
    about: string
    services: Record<string, string>
    testimonials: Record<string, string>
    logo?: string
  }
  setImageManagement: (data: any) => void
}

export default function ImageManagementSection({ imageManagement, setImageManagement }: ImageManagementProps) {
  const [activeSection, setActiveSection] = useState("hero")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Load image management data from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem("darpan_images")
    if (savedImages) {
      setImageManagement(JSON.parse(savedImages))
    } else {
      // Set default images
      const defaultImages = {
        hero: [
          "/placeholder.svg?height=600&width=800&text=Luxury+Interior+Design+Showcase+Living+Room",
          "/placeholder.svg?height=600&width=800&text=Modern+Kitchen+with+Marble+Island+and+Brass+Fixtures",
          "/placeholder.svg?height=600&width=800&text=Elegant+Master+Bedroom+with+Tufted+Headboard",
          "/placeholder.svg?height=600&width=800&text=Sophisticated+Dining+Room+with+Crystal+Chandelier",
          "/placeholder.svg?height=600&width=800&text=Luxury+Bathroom+with+Freestanding+Tub+and+Natural+Stone",
        ],
        about: "/placeholder.svg?height=500&width=600&text=Interior+Designer+at+Work+with+Fabric+Samples",
        services: {},
        testimonials: {},
      }
      setImageManagement(defaultImages)
    }
  }, [])

  // Save to localStorage whenever imageManagement changes
  useEffect(() => {
    localStorage.setItem("darpan_images", JSON.stringify(imageManagement))
  }, [imageManagement])

  const sections = [
    { id: "hero", label: "Hero Carousel", icon: Home, description: "Main homepage slideshow images" },
    { id: "about", label: "About Section", icon: Users, description: "About page featured image" },
    { id: "services", label: "Services", icon: SettingsIcon, description: "Service section images" },
    { id: "testimonials", label: "Testimonials", icon: Users, description: "Client testimonial photos" },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, section: string, key?: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    console.log(`Uploading ${files.length} files to ${section}`) // Debug log

    const fileArray = Array.from(files)
    const imagePromises = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          reject(new Error("File is not an image"))
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string)
          } else {
            reject(new Error("Failed to read file"))
          }
        }
        reader.onerror = () => reject(new Error("FileReader error"))
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises)
      .then((images) => {
        console.log(`Successfully processed ${images.length} images`) // Debug log

        setImageManagement((prev: any) => {
          const updated = { ...prev }

          if (section === "hero") {
            updated[section] = [...(updated[section] || []), ...images]
          } else if (section === "about") {
            updated[section] = images[0]
          } else if (section === "services" || section === "testimonials") {
            if (key) {
              updated[section] = { ...updated[section], [key]: images[0] }
            }
          }

          console.log("Updated image management:", updated)

          // Save to localStorage immediately
          localStorage.setItem("darpan_images", JSON.stringify(updated))

          // Use setTimeout to dispatch event after state update completes
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("darpan-images-updated"))
          }, 0)

          return updated
        })

        // Clear the input value to allow re-uploading the same file
        e.target.value = ""
      })
      .catch((error) => {
        console.error("Error processing images:", error)
        alert("Error uploading images. Please try again.")
        e.target.value = ""
      })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const logoUrl = event.target.result as string

        setImageManagement((prev: any) => {
          const updated = { ...prev, logo: logoUrl }

          // Save to localStorage immediately
          localStorage.setItem("darpan_images", JSON.stringify(updated))

          // Use setTimeout to dispatch event after state update completes
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("darpan-images-updated"))
          }, 0)

          return updated
        })

        // Clear the input value
        e.target.value = ""
      }
    }

    reader.onerror = () => {
      alert("Error reading file. Please try again.")
      e.target.value = ""
    }

    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setImageManagement((prev: any) => {
      const updated = { ...prev }
      delete updated.logo

      // Save to localStorage immediately
      localStorage.setItem("darpan_images", JSON.stringify(updated))

      // Use setTimeout to dispatch event after state update completes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("darpan-images-updated"))
      }, 0)

      return updated
    })
  }

  const removeImage = (section: string, index?: number, key?: string) => {
    setImageManagement((prev: any) => {
      const updated = { ...prev }

      if (section === "hero") {
        if (typeof index === "number") {
          updated[section] = updated[section].filter((_: any, i: number) => i !== index)
        }
      } else if (section === "about") {
        updated[section] = ""
      } else if ((section === "services" || section === "testimonials") && key) {
        delete updated[section][key]
      }

      // Save to localStorage immediately
      localStorage.setItem("darpan_images", JSON.stringify(updated))

      // Use setTimeout to dispatch event after state update completes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("darpan-images-updated"))
      }, 0)

      return updated
    })
  }

  const reorderImages = (section: string, fromIndex: number, toIndex: number) => {
    if (section !== "hero") return

    setImageManagement((prev: any) => {
      const updated = { ...prev }
      const items = [...updated[section]]
      const [reorderedItem] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, reorderedItem)
      updated[section] = items
      return updated
    })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderImages(activeSection, draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  const renderHeroSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Hero Carousel Images</h3>
          <p className="text-gray-600 text-sm">Manage the main slideshow images on your homepage. Drag to reorder.</p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e, "hero")}
            className="hidden"
            id="hero-upload"
            ref={(input) => {
              if (input) {
                input.onclick = () => {
                  input.value = ""
                }
              }
            }}
          />
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => document.getElementById("hero-upload")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Images
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageManagement.hero?.map((image, index) => (
          <div
            key={`hero-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="relative group bg-white rounded-lg shadow-md overflow-hidden cursor-move"
          >
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
              #{index + 1}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeImage("hero", index)}
                className="bg-red-600 hover:bg-red-700 text-white h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <GripVertical className="h-5 w-5 text-white bg-black/50 rounded" />
            </div>
            <Image
              src={image || "/placeholder.svg"}
              alt={`Hero image ${index + 1}`}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <p className="text-sm text-gray-600">Hero Image {index + 1}</p>
              <p className="text-xs text-gray-500">Drag to reorder</p>
            </div>
          </div>
        ))}
      </div>

      {(!imageManagement.hero || imageManagement.hero.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hero images uploaded yet</p>
          <Button type="button" variant="outline" onClick={() => document.getElementById("hero-upload")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Your First Hero Image
          </Button>
        </div>
      )}
    </div>
  )

  const renderAboutSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">About Section Image</h3>
          <p className="text-gray-600 text-sm">Featured image for the about section</p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "about")}
            className="hidden"
            id="about-upload"
            ref={(input) => {
              if (input) {
                input.onclick = () => {
                  input.value = ""
                }
              }
            }}
          />
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => document.getElementById("about-upload")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {imageManagement.about ? "Replace Image" : "Add Image"}
          </Button>
        </div>
      </div>

      {imageManagement.about ? (
        <div className="relative group bg-white rounded-lg shadow-md overflow-hidden max-w-md">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeImage("about")}
              className="bg-red-600 hover:bg-red-700 text-white h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Image
            src={imageManagement.about || "/placeholder.svg"}
            alt="About section image"
            width={400}
            height={300}
            className="w-full h-64 object-cover"
          />
          <div className="p-3">
            <p className="text-sm text-gray-600">About Section Featured Image</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 max-w-md">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No about image uploaded yet</p>
          <Button type="button" variant="outline" onClick={() => document.getElementById("about-upload")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload About Image
          </Button>
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "hero":
        return renderHeroSection()
      case "about":
        return renderAboutSection()
      case "services":
        return (
          <div className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Services image management coming soon</p>
          </div>
        )
      case "testimonials":
        return (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Testimonials image management coming soon</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white/60 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Image Sections</h3>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{section.label}</div>
                    <div className="text-xs opacity-75">{section.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Logo Management Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">Website Logo</h4>

            {imageManagement.logo ? (
              <div className="space-y-3">
                <div className="relative group bg-white rounded-lg shadow-sm overflow-hidden border">
                  <Image
                    src={imageManagement.logo || "/placeholder.svg"}
                    alt="Website logo"
                    width={120}
                    height={60}
                    className="w-full h-16 object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeLogo}
                      className="bg-red-600 hover:bg-red-700 text-white h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active on website
                </div>

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                    ref={(input) => {
                      if (input) {
                        input.onclick = () => {
                          input.value = ""
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                    className="flex-1 text-xs"
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={removeLogo}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 text-xs bg-transparent"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-amber-600">D</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Using default logo</p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  ref={(input) => {
                    if (input) {
                      input.onclick = () => {
                        input.value = ""
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-xs"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Logo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3">
        <div className="bg-white/60 rounded-lg p-6 shadow-sm">{renderContent()}</div>
      </div>
    </div>
  )
}

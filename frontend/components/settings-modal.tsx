"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Mail, Eye, SettingsIcon, Download, Upload, Moon, Sun } from "lucide-react"
import { useTheme } from "../contexts/theme-context"

interface SettingsModalProps {
  onClose: () => void
  onAdminLogin: () => void
  isAdmin?: boolean
}

export default function SettingsModal({ onClose, onAdminLogin, isAdmin = false }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("general")
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Darpan Interiors",
    tagline: "Transforming Spaces, Creating Dreams",
    email: "info@darpaninteriors.com",
    phone: "+1 (555) 123-4567",
    address: "123 Design Street, Creative City, CC 12345",
    socialMedia: {
      instagram: "@darpaninteriors",
      facebook: "DarpanInteriors",
      linkedin: "darpan-interiors",
    },
    theme: {
      primaryColor: "amber",
      accentColor: "orange",
      darkMode: false,
    },
    display: {
      showContactInfo: true,
      showSocialLinks: true,
      showTestimonials: true,
      projectsPerPage: 6,
      enableAnimations: true,
    },
  })

  // User tabs - only dark mode
  const userTabs = [{ id: "preferences", label: "Preferences", icon: SettingsIcon }]

  // Admin tabs - full settings (remove theme tab)
  const adminTabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "display", label: "Display", icon: Eye },
  ]

  const tabs = isAdmin ? adminTabs : userTabs

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSiteSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleDirectChange = (key: string, value: any) => {
    setSiteSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(siteSettings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "darpan-interiors-settings.json"
    link.click()
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string)
          setSiteSettings(settings)
        } catch (error) {
          alert("Invalid settings file")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800/95 to-gray-900" : "bg-gradient-to-br from-white via-gray-50/95 to-white"} rounded-lg w-full ${isAdmin ? "max-w-4xl" : "max-w-md"} mx-4 max-h-[90vh] overflow-hidden shadow-2xl`}
      >
        <div className="flex">
          {/* Sidebar - only show for admin */}
          {isAdmin && (
            <div
              className={`w-64 ${isDarkMode ? "bg-gradient-to-b from-gray-800 to-gray-900 border-gray-600" : "bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200"} border-r`}
            >
              <div className={`p-6 border-b ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Admin Settings
                  </h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className={`h-4 w-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                  </Button>
                </div>
              </div>
              <nav className="p-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? isDarkMode
                            ? "bg-gray-700/80 text-gray-100 border border-gray-600"
                            : "bg-gray-200/80 text-gray-800 border border-gray-300"
                          : isDarkMode
                            ? "text-gray-300 hover:bg-gray-700/50"
                            : "text-gray-600 hover:bg-gray-200/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[90vh]">
            {/* Header for non-admin users */}
            {!isAdmin && (
              <div className={`p-6 border-b ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-light ${isDarkMode ? "text-white" : "text-gray-900"}`}>Preferences</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className={`h-4 w-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                  </Button>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* User Preferences - Only Dark Mode */}
              {(!isAdmin || activeTab === "preferences") && (
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}>
                      {isAdmin ? "User Preferences" : "Display Preferences"}
                    </h3>

                    {/* Dark Mode Section */}
                    <div
                      className={`${isDarkMode ? "bg-gradient-to-r from-gray-800/90 to-gray-700/90 border-gray-600" : "bg-gradient-to-r from-gray-100/90 to-gray-200/90 border-gray-300"} border rounded-lg p-6 mb-6`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full flex items-center justify-center`}
                          >
                            {isDarkMode ? (
                              <Moon className={`h-6 w-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                            ) : (
                              <Sun className={`h-6 w-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                            )}
                          </div>
                          <div>
                            <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                              Dark Mode
                            </h4>
                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              Switch between light and dark themes
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-11 h-6 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"} peer-focus:outline-none peer-focus:ring-4 ${isDarkMode ? "peer-focus:ring-gray-700" : "peer-focus:ring-gray-400"} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDarkMode ? "peer-checked:bg-gray-500" : "peer-checked:bg-gray-600"}`}
                          ></div>
                        </label>
                      </div>
                    </div>

                    {/* Info Section - only for non-admin */}
                    {!isAdmin && (
                      <div
                        className={`${isDarkMode ? "bg-gradient-to-r from-gray-800/90 to-gray-700/90 border-gray-600" : "bg-gradient-to-r from-gray-100/90 to-gray-200/90 border-gray-300"} border rounded-lg p-6`}
                      >
                        <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"} mb-2`}>
                          About Darpan Interiors
                        </h4>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-3`}>
                          Professional interior design services with over 12 years of experience in creating beautiful,
                          functional spaces.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Projects:
                            </span>
                            <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ml-2`}>150+</span>
                          </div>
                          <div>
                            <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Experience:
                            </span>
                            <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ml-2`}>12+ Years</span>
                          </div>
                          <div>
                            <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Satisfaction:
                            </span>
                            <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ml-2`}>98%</span>
                          </div>
                          <div>
                            <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Location:
                            </span>
                            <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ml-2`}>
                              Beverly Hills
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Settings (only shown when admin is logged in) */}
              {isAdmin && (
                <>
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                          General Settings
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              Site Name
                            </label>
                            <input
                              type="text"
                              value={siteSettings.siteName}
                              onChange={(e) => handleDirectChange("siteName", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              Tagline
                            </label>
                            <input
                              type="text"
                              value={siteSettings.tagline}
                              onChange={(e) => handleDirectChange("tagline", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className={`text-md font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                          Data Management
                        </h4>
                        <div className="flex gap-4">
                          <Button onClick={exportSettings} className="bg-green-600 hover:bg-green-700">
                            <Download className="h-4 w-4 mr-2" />
                            Export Settings
                          </Button>
                          <label className="cursor-pointer">
                            <input type="file" accept=".json" onChange={importSettings} className="hidden" />
                            <Button type="button" variant="outline">
                              <Upload className="h-4 w-4 mr-2" />
                              Import Settings
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "contact" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}>
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={siteSettings.email}
                              onChange={(e) => handleDirectChange("email", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={siteSettings.phone}
                              onChange={(e) => handleDirectChange("phone", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              value={siteSettings.address}
                              onChange={(e) => handleDirectChange("address", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-md font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                          Social Media
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              Instagram Handle
                            </label>
                            <input
                              type="text"
                              value={siteSettings.socialMedia.instagram}
                              onChange={(e) => handleSettingChange("socialMedia", "instagram", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              Facebook Page
                            </label>
                            <input
                              type="text"
                              value={siteSettings.socialMedia.facebook}
                              onChange={(e) => handleSettingChange("socialMedia", "facebook", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
                            >
                              LinkedIn Profile
                            </label>
                            <input
                              type="text"
                              value={siteSettings.socialMedia.linkedin}
                              onChange={(e) => handleSettingChange("socialMedia", "linkedin", e.target.value)}
                              className={`w-full px-4 py-3 border ${isDarkMode ? "border-gray-600 bg-gray-800/50 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "border-gray-300 bg-gray-50/50 text-gray-800 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:ring-2 focus:border-transparent`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "display" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}>
                          Display Preferences
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                Show Contact Information
                              </h4>
                              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Display contact details in footer and contact section
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={siteSettings.display.showContactInfo}
                                onChange={(e) => handleSettingChange("display", "showContactInfo", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                Show Social Links
                              </h4>
                              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Display social media links in contact section
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={siteSettings.display.showSocialLinks}
                                onChange={(e) => handleSettingChange("display", "showSocialLinks", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                Show Testimonials
                              </h4>
                              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Display client testimonials section
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={siteSettings.display.showTestimonials}
                                onChange={(e) => handleSettingChange("display", "showTestimonials", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                Show Animations
                              </h4>
                              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Enable smooth transitions and animations
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={siteSettings.display.enableAnimations}
                                onChange={(e) => handleSettingChange("display", "enableAnimations", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                Projects Per Page
                              </h4>
                              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Number of projects to show initially
                              </p>
                            </div>
                            <select
                              value={siteSettings.display.projectsPerPage}
                              onChange={(e) =>
                                handleSettingChange("display", "projectsPerPage", Number.parseInt(e.target.value))
                              }
                              className={`px-3 py-2 border rounded-lg ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-800"}`}
                            >
                              <option value={3}>3</option>
                              <option value={6}>6</option>
                              <option value={9}>9</option>
                              <option value={12}>12</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              className={`border-t ${isDarkMode ? "bg-gray-800/90 border-gray-600" : "bg-gray-100/90 border-gray-300"} px-8 py-4`}
            >
              <div className="flex justify-between items-center">
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {isAdmin ? "Settings are automatically saved" : "Preferences saved locally"}
                </p>
                <Button
                  onClick={onClose}
                  className={`${isDarkMode ? "bg-gray-600 hover:bg-gray-500 text-gray-100" : "bg-gray-700 hover:bg-gray-600 text-white"}`}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { signIn, signOut } from "next-auth/react"
import { X, Moon, Sun, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "../contexts/theme-context"

interface SettingsModalProps {
  onClose: () => void
  isAdmin?: boolean
}

export default function SettingsModal({ onClose, isAdmin }: SettingsModalProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/admin/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card
        className={`w-full max-w-md ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
        } shadow-2xl`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`${
                isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div
              className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className={`h-5 w-5 ${isDarkMode ? "text-amber-400" : "text-gray-600"}`} />
                ) : (
                  <Sun className={`h-5 w-5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                )}
                <div>
                  <Label
                    htmlFor="theme-toggle"
                    className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Dark Mode
                  </Label>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Toggle dark mode on/off</p>
                </div>
              </div>
              <Switch id="theme-toggle" checked={isDarkMode} onCheckedChange={toggleTheme} />
            </div>

            {/* Admin Section */}
            <div
              className={`p-4 rounded-lg border ${isDarkMode ? "border-gray-700 bg-gray-800/30" : "border-gray-200 bg-gray-50/50"}`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <User className={`h-5 w-5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
                <div>
                  <Label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Admin Access
                  </Label>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {isAdmin ? "You are signed in as an admin" : "Sign in to access admin features"}
                  </p>
                </div>
              </div>

              {isAdmin ? (
                <Button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  variant="outline"
                  className={`w-full ${
                    isDarkMode
                      ? "border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                      : "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                  }`}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
              ) : (
                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className={`w-full ${
                    isDarkMode
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  } text-white`}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? "Signing in..." : "Sign In with Google"}
                </Button>
              )}
            </div>

            {/* Info Section */}
            <div
              className={`p-4 rounded-lg ${isDarkMode ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-200"}`}
            >
              <p className={`text-xs ${isDarkMode ? "text-amber-200" : "text-amber-800"}`}>
                <strong>Note:</strong> Only authorized email addresses can access admin features. Contact the site
                administrator if you need admin access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

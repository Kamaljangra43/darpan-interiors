"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"

export default function AdminAccess() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const { isAuthenticated } = useAuth()

  // Admin access logic removed - no longer checking URL parameters
  // All admin UI components remain available for future backend integration

  return {
    showAdminLogin,
    setShowAdminLogin,
  }
}

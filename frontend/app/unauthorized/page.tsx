"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      router.push("/")
    }
  }, [countdown, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>Your email address is not authorized to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200 text-center">
              Only whitelisted email addresses can access this area. Please contact the administrator if you believe
              this is an error.
            </p>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Redirecting to home page in {countdown} seconds...
          </p>

          <div className="flex gap-2">
            <Button onClick={() => router.push("/")} className="flex-1" variant="default">
              Go Home Now
            </Button>
            <Button onClick={() => router.push("/admin/login")} className="flex-1" variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

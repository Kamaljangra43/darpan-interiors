import type { NextAuthOptions } from "next-auth"
import type { Provider } from "next-auth/providers"

// Get admin emails from environment variable
const getAdminEmails = (): string[] => {
  const adminEmailsString = process.env.ADMIN_EMAILS || ""
  return adminEmailsString
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
}

// Validate required environment variables
const validateEnvVars = () => {
  const requiredVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars.join(", "))
    console.error("Please check your .env.local file")
  }

  return missingVars.length === 0
}

// Run validation in development
if (process.env.NODE_ENV === "development") {
  validateEnvVars()
}

// Validate credentials exist
const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error("❌ Missing Google OAuth credentials")
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local")
}

// Create Google provider manually
const googleProvider: Provider = {
  id: "google",
  name: "Google",
  type: "oauth",
  wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
      scope: "openid email profile",
    },
  },
  idToken: true,
  checks: ["pkce", "state"],
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    }
  },
  style: {
    logo: "/google.svg",
    logoDark: "/google-dark.svg",
    bg: "#fff",
    text: "#000",
    bgDark: "#fff",
    textDark: "#000",
  },
  options: {
    clientId,
    clientSecret,
  },
}

export const authOptions: NextAuthOptions = {
  providers: [googleProvider],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Only allow sign in if user's email is in the admin list
        const adminEmails = getAdminEmails()

        if (!user.email) {
          console.log("❌ Sign in denied: No email provided")
          return false
        }

        if (adminEmails.includes(user.email)) {
          console.log("✅ Admin sign in successful:", user.email)
          return true
        }

        console.log("❌ Sign in denied: Email not in admin list:", user.email)
        // Redirect to unauthorized page if not an admin
        return "/unauthorized"
      } catch (error) {
        console.error("❌ Error in signIn callback:", error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          const adminEmails = getAdminEmails()
          token.isAdmin = user.email ? adminEmails.includes(user.email) : false
          token.email = user.email
          token.name = user.name
          token.picture = user.image
        }
        return token
      } catch (error) {
        console.error("❌ Error in jwt callback:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.isAdmin = token.isAdmin as boolean
          session.user.email = token.email as string
          session.user.name = token.name as string
          session.user.image = token.picture as string
        }
        return session
      } catch (error) {
        console.error("❌ Error in session callback:", error)
        return session
      }
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

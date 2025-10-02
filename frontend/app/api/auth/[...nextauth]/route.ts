import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Initialize NextAuth with our options
const handler = NextAuth(authOptions)

// Export GET and POST handlers
export { handler as GET, handler as POST }

// Optional: Add OPTIONS handler for CORS
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

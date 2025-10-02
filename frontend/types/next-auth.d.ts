import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean
      email: string
      name: string
      image: string
    } & DefaultSession["user"]
  }

  interface User {
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean
    email?: string
    name?: string
    picture?: string
  }
}

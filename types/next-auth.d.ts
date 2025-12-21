import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
    accessToken: string
    refreshToken: string
    role: string
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    accessToken: string
    refreshToken: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessToken: string
    refreshToken: string
    role: string
  }
}

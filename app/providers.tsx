"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"
import type React from "react"
import { AuthProvider } from "@/lib/auth-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </SessionProvider>
  )
}

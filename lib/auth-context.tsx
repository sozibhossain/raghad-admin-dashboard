"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  image?: string
  role: string
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("auth")
    if (stored) {
      try {
        const { user: storedUser, accessToken: storedToken } = JSON.parse(stored)
        setUser(storedUser)
        setAccessToken(storedToken)
      } catch (error) {
        localStorage.removeItem("auth")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api"
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      const { accessToken: token, _id, role, user: userData } = data.data

      const authUser: User = {
        id: _id,
        email: userData.email,
        name: userData.name,
        image: userData.avatar?.url,
        role,
      }

      setUser(authUser)
      setAccessToken(token)
      localStorage.setItem("auth", JSON.stringify({ user: authUser, accessToken: token }))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    "Invalid email or password": "The email or password you entered is incorrect.",
    "Invalid credentials": "Please provide both email and password.",
    CredentialsSignin: "Invalid email or password.",
    AccessDenied: "You do not have permission to access this resource.",
    OAuthSignin: "Error connecting to the OAuth provider.",
    OAuthCallback: "Error in OAuth callback.",
    EmailSigninEmail: "Check your email for the sign-in link.",
    Callback: "An error occurred during callback.",
    EmailCreateAccount: "Could not create user account.",
    SessionCallback: "An error occurred in the session callback.",
    SignoutError: "An error occurred during sign out.",
  }

  const message = error ? errorMessages[error] || error : "An authentication error occurred."

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center text-4xl">⚠️</div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Please check your credentials and try again. If the problem persists, contact support.
          </p>
          <div className="flex gap-3">
            <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/auth/forgot-password">Reset Password</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

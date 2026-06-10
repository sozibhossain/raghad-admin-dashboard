import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lightweight session check via the NextAuth session cookie.
  // (Avoids Edge Runtime incompatibility with the full getToken/OpenID client.)
  const sessionCookie =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value

  const isAuthRoute = pathname.startsWith("/auth")
  const isProtectedRoute = pathname === "/" || pathname.startsWith("/admin")

  // Protect admin routes: send unauthenticated users to the login page.
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Keep already-authenticated users out of the auth pages.
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/admin/:path*", "/auth/:path*"],
}

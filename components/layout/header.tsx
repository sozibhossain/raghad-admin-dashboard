"use client"

import { useSession } from "next-auth/react"
import { ChevronRight } from "lucide-react"

interface HeaderProps {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {breadcrumbs && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4" />}
                  <span>{crumb.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          {session?.user?.image && (
            <img
              src={session.user.image || "/placeholder.svg"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>
      </div>
    </header>
  )
}

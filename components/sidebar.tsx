"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  UploadCloud, 
  BarChart3, 
  Wand2, 
  Settings,
  Leaf,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/upload", label: "Upload Dataset", icon: UploadCloud },
    { href: "/analyze", label: "Analytics", icon: BarChart3 },
    { href: "/results", label: "Cleaning Results", icon: Wand2 },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar hidden md:flex flex-col">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <Leaf className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight font-heading">Data Sanitizer Pro</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive = link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}

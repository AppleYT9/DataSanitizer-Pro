"use client"

import Link from "next/link"
import { Leaf, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground font-heading">
            Data Sanitizer <span className="text-primary">Pro</span>
          </span>
        </Link>
        <nav className="hidden flex-1 justify-center items-center gap-12 md:flex">
          <Link href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/upload" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Upload Data
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/upload">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

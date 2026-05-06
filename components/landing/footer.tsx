import { Database } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Database className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            DataSanitizer Pro
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with Next.js, TypeScript & AI. Production-grade data cleaning.
        </p>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center md:px-16">
          <div className="pointer-events-none absolute inset-0 bg-primary/3" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to clean your data?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              Upload your dataset and get actionable insights in seconds. No setup required.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
              <Link href="/upload">
                Upload Your Dataset
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

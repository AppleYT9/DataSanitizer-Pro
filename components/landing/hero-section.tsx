import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-24 lg:px-8 lg:pb-32 lg:pt-36">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">AI-Powered Data Cleaning</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Clean your data{" "}
            <span className="text-primary">in minutes,</span>{" "}
            not hours
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Upload your datasets and let our intelligent engine detect duplicates,
            missing values, outliers, and inconsistencies. Review AI recommendations
            and download pristine data.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/upload">
                Start Cleaning Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent">
              <Link href="/#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature pills */}
        <div className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          {[
            { icon: Zap, label: "Instant Profiling" },
            { icon: Shield, label: "Secure Processing" },
            { icon: Sparkles, label: "Smart Recommendations" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
            >
              <item.icon className="h-4 w-4 text-primary" />
              <span className="text-sm text-secondary-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

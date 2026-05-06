import {
  Search,
  Trash2,
  PenTool,
  BarChart3,
  Download,
  Settings2,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Search,
    title: "AI Semantic Understanding",
    description:
      "Automatically identify emails, phone numbers, currencies, and more to apply context-aware cleaning strategies.",
  },
  {
    icon: Sparkles,
    title: "ML Readiness Scoring",
    description:
      "Get a dynamic readiness score that measures how optimized your data is for machine learning models.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description:
      "Identify patterns and anomalies through heatmaps, distribution histograms, and correlation matrices.",
  },
  {
    icon: MessageSquare,
    title: "AI Data Assistant",
    description:
      "Chat with our integrated AI to understand data quality issues and get smart cleaning recommendations.",
  },
  {
    icon: Settings2,
    title: "Advanced Clean Engine",
    description:
      "Apply professional scaling, encoding, and imputation methods to prepare your data for analysis.",
  },
  {
    icon: Download,
    title: "Export & Reproduce",
    description:
      "Download ML-ready datasets and track every transformation applied for full transparency.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to clean your data
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            A complete toolkit for data quality management, from detection to resolution.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-card transition-colors hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

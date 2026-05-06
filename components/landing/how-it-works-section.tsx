import { Upload, Search, Settings, Download } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Dataset",
    description:
      "Drag and drop a CSV or Excel file. We support files up to 50MB with automatic structure validation.",
  },
  {
    number: "02",
    icon: Search,
    title: "AI Profiles Your Data",
    description:
      "Our engine scans every column, detects data types, missing values, duplicates, outliers, and format inconsistencies.",
  },
  {
    number: "03",
    icon: Settings,
    title: "Review & Configure",
    description:
      "Review AI-recommended cleaning strategies. Accept them as-is or customize each action to match your needs.",
  },
  {
    number: "04",
    icon: Download,
    title: "Download Clean Data",
    description:
      "Apply the cleaning pipeline and download your pristine dataset along with a detailed quality report.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-border bg-card/30 px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Four steps to cleaner data
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-3xl font-bold text-primary/20">{step.number}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

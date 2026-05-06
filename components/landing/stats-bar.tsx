export function StatsBar() {
  const stats = [
    { value: "10x", label: "Faster than manual cleaning" },
    { value: "99.2%", label: "Issue detection accuracy" },
    { value: "50MB", label: "Max file size supported" },
    { value: "7+", label: "Cleaning strategies" },
  ]

  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

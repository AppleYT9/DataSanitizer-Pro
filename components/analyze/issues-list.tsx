"use client"

import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DataIssue } from "@/lib/data-processor"

interface IssuesListProps {
  issues: DataIssue[]
}

const severityConfig = {
  high: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    badge: "bg-warning/10 text-warning border-warning/20",
  },
  low: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
}

const typeLabels: Record<string, string> = {
  missing: "Missing Values",
  duplicate: "Duplicates",
  outlier: "Outliers",
  type_mismatch: "Type Mismatch",
  inconsistent_format: "Format Issue",
  inconsistent_case: "Casing Issue",
}

export function IssuesList({ issues }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-success/20 bg-success/5 p-6 text-center">
        <p className="font-medium text-success">No issues detected!</p>
        <p className="mt-1 text-sm text-muted-foreground">Your dataset looks clean.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const config = severityConfig[issue.severity]
        const Icon = config.icon

        return (
          <div
            key={issue.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4",
              config.border,
              config.bg
            )}
          >
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.color)} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground">{issue.description}</p>
                <Badge variant="outline" className={cn("text-[10px]", config.badge)}>
                  {issue.severity}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {typeLabels[issue.type] || issue.type}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Recommendation: {issue.recommendation.description}
              </p>
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {issue.affectedRows} rows
            </span>
          </div>
        )
      })}
    </div>
  )
}

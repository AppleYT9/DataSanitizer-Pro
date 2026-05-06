"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ColumnProfile } from "@/lib/data-processor"

interface ColumnProfileCardProps {
  column: ColumnProfile
}

const typeColors: Record<string, string> = {
  string: "bg-primary/10 text-primary border-primary/20",
  number: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  date: "bg-warning/10 text-warning border-warning/20",
  boolean: "bg-green-500/10 text-green-500 border-green-500/20",
  mixed: "bg-destructive/10 text-destructive border-destructive/20",
  categorical: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  continuous: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  binary: "bg-green-500/10 text-green-500 border-green-500/20",
  text: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  timestamp: "bg-warning/10 text-warning border-warning/20",
}

export function ColumnProfileCard({ column }: ColumnProfileCardProps) {
  const completeness = 100 - column.missingPercent

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground truncate">
            {column.name}
          </CardTitle>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className={typeColors[column.type] || ""}>
              {column.type}
            </Badge>
            {column.semanticType && (
              <Badge variant="secondary" className="text-[10px] h-4 py-0">
                {column.semanticType}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Completeness bar */}
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completeness</span>
            <span className="font-mono text-foreground">{completeness.toFixed(1)}%</span>
          </div>
          <Progress value={completeness} className="mt-1 h-1.5" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-secondary p-2">
            <span className="text-muted-foreground">Unique</span>
            <p className="font-mono font-medium text-foreground">{column.uniqueCount}</p>
          </div>
          <div className="rounded-md bg-secondary p-2">
            <span className="text-muted-foreground">Missing</span>
            <p className="font-mono font-medium text-foreground">{column.missingCount}</p>
          </div>
          {(column.type === "continuous" || column.type === "categorical" || column.type === "number" as any) && (
            <>
              <div className="rounded-md bg-secondary p-2">
                <span className="text-muted-foreground">Mean</span>
                <p className="font-mono font-medium text-foreground">{column.mean ?? "N/A"}</p>
              </div>
              <div className="rounded-md bg-secondary p-2">
                <span className="text-muted-foreground">Outliers</span>
                <p className="font-mono font-medium text-foreground">{column.outlierCount ?? 0}</p>
              </div>
            </>
          )}
          {column.type === "string" && (
            <>
              <div className="rounded-md bg-secondary p-2">
                <span className="text-muted-foreground">Avg Length</span>
                <p className="font-mono font-medium text-foreground">{column.avgLength ?? "N/A"}</p>
              </div>
              <div className="rounded-md bg-secondary p-2">
                <span className="text-muted-foreground">Case Issues</span>
                <p className="font-mono font-medium text-foreground">{column.inconsistentCaseCount ?? 0}</p>
              </div>
            </>
          )}
        </div>

        {/* Top values */}
        {column.topValues.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Top values</p>
            <div className="space-y-1">
              {column.topValues.slice(0, 3).map((tv) => (
                <div
                  key={tv.value}
                  className="flex items-center justify-between rounded bg-secondary px-2 py-1 text-xs"
                >
                  <span className="truncate text-foreground">{tv.value || "(empty)"}</span>
                  <span className="shrink-0 font-mono text-muted-foreground">{tv.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MissingValueHeatmapProps {
  headers: string[]
  rows: string[][]
}

export function MissingValueHeatmap({ headers, rows }: MissingValueHeatmapProps) {
  // Sample data for visualization if it's too large
  const displayRows = useMemo(() => {
    if (rows.length <= 100) return rows
    const step = Math.floor(rows.length / 100)
    return rows.filter((_, i) => i % step === 0).slice(0, 100)
  }, [rows])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Missing Value Heatmap</CardTitle>
        <CardDescription>
          A visual representation of null values across the dataset (sampled to 100 rows).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <div className="flex flex-col gap-[1px] bg-border/50">
            {/* Header labels */}
            <div className="flex gap-[1px]">
              <div className="w-12 shrink-0 bg-background px-1 text-[8px] text-muted-foreground">Row #</div>
              {headers.map((h) => (
                <div
                  key={h}
                  className="flex-1 truncate bg-background px-1 text-center text-[8px] font-medium text-foreground"
                  title={h}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Heatmap rows */}
            <div className="flex flex-col gap-[1px]">
              {displayRows.map((row, i) => (
                <div key={i} className="flex gap-[1px]">
                  <div className="flex w-12 shrink-0 items-center justify-center bg-background text-[8px] text-muted-foreground/50">
                    {i * (rows.length > 100 ? Math.floor(rows.length / 100) : 1) + 1}
                  </div>
                  {row.map((cell, j) => {
                    const isMissing = cell.trim() === ""
                    return (
                      <TooltipProvider key={j}>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <div
                              className={`h-4 flex-1 transition-colors ${isMissing ? "bg-destructive/60 hover:bg-destructive/80" : "bg-primary/20 hover:bg-primary/40"
                                }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[10px]">
                            <p>
                              <span className="font-semibold">{headers[j]}</span>:{" "}
                              {isMissing ? "Missing" : "Present"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-6 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 bg-primary/20 rounded-sm" />
              <span className="text-muted-foreground">Data Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 bg-destructive/60 rounded-sm" />
              <span className="text-muted-foreground">Missing Value</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CorrelationMatrixProps {
  headers: string[]
  rows: string[][]
  columns: any[]
}

export function CorrelationMatrix({ headers, rows, columns }: CorrelationMatrixProps) {
  const numericCols = useMemo(() => {
    return columns.filter((col) => ["continuous", "binary", "number"].includes(col.type)).map(c => c.name)
  }, [columns])

  const correlations = useMemo(() => {
    if (numericCols.length < 2) return []

    const matrix: { x: string; y: string; value: number }[] = []

    // Extract numeric values for each column
    const data: Record<string, number[]> = {}
    numericCols.forEach(col => {
      const idx = headers.indexOf(col)
      data[col] = rows.map(r => Number(r[idx])).filter(n => !Number.isNaN(n))
    })

    // Ensure all columns have the same length (use the minimum common length)
    // Actually, it's better to just use the rows where all selected columns are numeric
    const cleanNumericRows: number[][] = []
    rows.forEach(row => {
      const parsedRow = numericCols.map(col => Number(row[headers.indexOf(col)]))
      if (parsedRow.every(v => !Number.isNaN(v))) {
        cleanNumericRows.push(parsedRow)
      }
    })

    if (cleanNumericRows.length < 2) return []

    // Calculate Pearson correlation
    const calculateCorrelation = (xIdx: number, yIdx: number) => {
      const x = cleanNumericRows.map(r => r[xIdx])
      const y = cleanNumericRows.map(r => r[yIdx])
      const n = x.length

      const sumX = x.reduce((a, b) => a + b, 0)
      const sumY = y.reduce((a, b) => a + b, 0)
      const sumXY = x.reduce((a, b, i) => a + b * y[i], 0)
      const sumX2 = x.reduce((a, b) => a + b * b, 0)
      const sumY2 = y.reduce((a, b) => a + b * b, 0)

      const numerator = n * sumXY - sumX * sumY
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

      if (denominator === 0) return 0
      return numerator / denominator
    }

    numericCols.forEach((colY, yIdx) => {
      numericCols.forEach((colX, xIdx) => {
        matrix.push({
          x: colX,
          y: colY,
          value: Math.round(calculateCorrelation(xIdx, yIdx) * 100) / 100
        })
      })
    })

    return matrix
  }, [numericCols, headers, rows])

  if (numericCols.length < 2) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center border-dashed text-center">
        <p className="text-muted-foreground">At least two numeric columns are required for correlation analysis.</p>
      </Card>
    )
  }

  const getColor = (value: number) => {
    const abs = Math.abs(value)
    if (value > 0) return `rgba(var(--primary-rgb), ${abs})`
    return `rgba(var(--destructive-rgb), ${abs})`
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Feature Correlation Matrix</CardTitle>
        <CardDescription>
          Understand relationships between numeric variables (Pearson Correlation).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="grid gap-[2px] p-2 bg-border/20 rounded-lg"
            style={{ gridTemplateColumns: `repeat(${numericCols.length}, minmax(40px, 1fr))` }}>
            {correlations.map((cell, i) => (
              <TooltipProvider key={i}>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div
                      className="aspect-square flex items-center justify-center rounded-sm text-[10px] font-mono transition-transform hover:scale-110 cursor-default border border-border/10"
                      style={{
                        backgroundColor: cell.value > 0
                          ? `hsl(var(--primary) / ${Math.max(0.05, Math.abs(cell.value))})`
                          : `hsl(var(--destructive) / ${Math.max(0.05, Math.abs(cell.value))})`,
                        color: Math.abs(cell.value) > 0.6 ? "white" : "inherit"
                      }}
                    >
                      {cell.value.toFixed(1)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-xs">
                      <p className="font-semibold">{cell.x} ↔ {cell.y}</p>
                      <p className={cell.value > 0 ? "text-primary" : "text-destructive"}>
                        Correlation: <span className="font-mono">{cell.value}</span>
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 bg-primary rounded-sm" />
              <span>Positive (Strong)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 bg-primary/20 rounded-sm" />
              <span>Positive (Weak)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 bg-destructive/20 rounded-sm" />
              <span>Negative (Weak)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 bg-destructive rounded-sm" />
              <span>Negative (Strong)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

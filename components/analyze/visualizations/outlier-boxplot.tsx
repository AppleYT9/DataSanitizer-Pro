"use client"

import React, { useMemo } from "react"
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OutlierBoxplotProps {
  headers: string[]
  rows: string[][]
  columns: any[]
}

const NUMERIC_TYPES = ["continuous", "binary", "number"]

export function OutlierBoxplot({ headers, rows, columns }: OutlierBoxplotProps) {
  const numericColumns = useMemo(() => {
    return columns.filter((col) => NUMERIC_TYPES.includes(col.type))
  }, [columns])

  const [selectedCol, setSelectedCol] = React.useState<string>(
    numericColumns.length > 0 ? numericColumns[0].name : ""
  )

  const boxData = useMemo(() => {
    if (!selectedCol) return null

    const colIndex = headers.indexOf(selectedCol)
    const values = rows
      .map((r) => Number(r[colIndex]))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b)

    if (values.length < 4) return null

    const min = values[0]
    const max = values[values.length - 1]
    const q1 = values[Math.floor(values.length * 0.25)]
    const median = values[Math.floor(values.length * 0.5)]
    const q3 = values[Math.floor(values.length * 0.75)]
    const iqr = q3 - q1
    const lowerWhisker = Math.max(min, q1 - 1.5 * iqr)
    const upperWhisker = Math.min(max, q3 + 1.5 * iqr)

    const outliers = values
      .filter((v) => v < lowerWhisker || v > upperWhisker)
      .map((v, i) => ({ x: selectedCol, y: v, id: i }))

    return { name: selectedCol, min, max, q1, median, q3, lowerWhisker, upperWhisker, outliers }
  }, [selectedCol, headers, rows])

  // Compose summary stats data for chart rendering
  const summaryChartData = useMemo(() => {
    if (!boxData) return []
    return [
      { name: "Min", value: boxData.min },
      { name: "Q1", value: boxData.q1 },
      { name: "Median", value: boxData.median },
      { name: "Q3", value: boxData.q3 },
      { name: "Max", value: boxData.max },
    ]
  }, [boxData])

  if (numericColumns.length === 0) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center border-dashed text-center">
        <p className="text-muted-foreground">No numeric columns found for outlier analysis.</p>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle>Outlier Boxplot</CardTitle>
          <CardDescription>Key distribution metrics and outlier summary.</CardDescription>
        </div>
        <Select value={selectedCol} onValueChange={setSelectedCol}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {numericColumns.map((col) => (
              <SelectItem key={col.name} value={col.name}>
                {col.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {boxData ? (
          <div className="space-y-4">
            {/* Summary stats bar chart */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={summaryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-background p-2 shadow-md text-xs">
                            <p className="font-semibold">{payload[0].name}</p>
                            <p className="text-primary font-mono">{payload[0].value}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary) / 0.7)" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Stat pills row */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 text-xs text-center">
              {[
                { label: "Min", value: boxData.min },
                { label: "Q1 (25%)", value: boxData.q1 },
                { label: "Median", value: boxData.median, highlight: true },
                { label: "Q3 (75%)", value: boxData.q3 },
                { label: "Max", value: boxData.max },
              ].map((s) => (
                <div key={s.label} className={`rounded-lg p-2 ${s.highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                  <p className="text-muted-foreground">{s.label}</p>
                  <p className={`font-mono font-bold ${s.highlight ? "text-primary" : "text-foreground"}`}>
                    {typeof s.value === "number" ? s.value.toFixed(2) : "N/A"}
                  </p>
                </div>
              ))}
            </div>

            {boxData.outliers.length > 0 && (
              <p className="text-xs text-destructive text-center">
                ⚠ {boxData.outliers.length} outlier{boxData.outliers.length > 1 ? "s" : ""} detected outside IQR bounds
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-[260px] items-center justify-center">
            <p className="text-muted-foreground text-sm">Insufficient data to generate boxplot (need ≥4 rows).</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

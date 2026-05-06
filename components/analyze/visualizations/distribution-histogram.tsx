"use client"

import React, { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DistributionHistogramProps {
  headers: string[]
  rows: string[][]
  columns: any[]
}

export function DistributionHistogram({ headers, rows, columns }: DistributionHistogramProps) {
  const numericColumns = useMemo(() => {
    return columns.filter((col) => ["continuous", "binary", "number"].includes(col.type))
  }, [columns])

  const [selectedCol, setSelectedCol] = React.useState<string>(
    numericColumns.length > 0 ? numericColumns[0].name : ""
  )

  const chartData = useMemo(() => {
    if (!selectedCol) return []

    const colIndex = headers.indexOf(selectedCol)
    const values = rows
      .map((r) => Number(r[colIndex]))
      .filter((n) => !Number.isNaN(n))

    if (values.length === 0) return []

    const min = Math.min(...values)
    const max = Math.max(...values)
    const binCount = 10
    const binSize = (max - min) / binCount

    const bins = Array.from({ length: binCount }, (_, i) => ({
      start: min + i * binSize,
      end: min + (i + 1) * binSize,
      count: 0,
      label: `${(min + i * binSize).toFixed(1)} - ${(min + (i + 1) * binSize).toFixed(1)}`,
    }))

    values.forEach((v) => {
      let binIdx = Math.floor((v - min) / binSize)
      if (binIdx >= binCount) binIdx = binCount - 1
      if (binIdx < 0) binIdx = 0
      bins[binIdx].count++
    })

    return bins
  }, [selectedCol, headers, rows])

  if (numericColumns.length === 0) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center border-dashed text-center">
        <p className="text-muted-foreground">No numeric columns found for distribution analysis.</p>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle>Column Distribution</CardTitle>
          <CardDescription>Visualize the frequency distribution of numeric values.</CardDescription>
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={50}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border border-border bg-background p-2 shadow-md">
                        <p className="text-xs font-semibold">{data.label}</p>
                        <p className="text-sm text-primary">
                          Count: <span className="font-mono">{data.count}</span>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.8)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

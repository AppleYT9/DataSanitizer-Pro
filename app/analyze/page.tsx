"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { 
  BarChart3, 
  FileSpreadsheet, 
  ChevronRight, 
  Clock, 
  Database,
  ArrowUpRight,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AnalyzeIndexPage() {
  const [datasets, setDatasets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const res = await fetch("/api/dataset")
        const data = await res.json()
        setDatasets(data)
      } catch (err) {
        console.error("Failed to fetch datasets", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDatasets()
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Data Analytics</h1>
              <p className="text-muted-foreground mt-1">Select a dataset to view detailed profiling and visualizations.</p>
            </div>
            <Button asChild>
              <Link href="/upload">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                New Dataset
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <Activity className="h-10 w-10 animate-spin text-primary/50" />
              <p className="text-muted-foreground">Loading your datasets...</p>
            </div>
          ) : datasets.length === 0 ? (
            <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No datasets analyzed yet</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Upload a CSV or Excel file to get started with intelligent profiling and data quality analysis.
              </p>
              <Button asChild>
                <Link href="/upload">Upload First Dataset</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((ds) => (
                <Link key={ds.id} href={`/analyze/${ds.id}`}>
                  <Card className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer h-full border-border group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {ds.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-4 truncate">{ds.fileName}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(ds.uploadedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Quality</p>
                          <p className="text-lg font-bold text-primary">{ds.qualityScore ?? "N/A"}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Rows</p>
                          <p className="text-lg font-bold">{ds.totalRows.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Analysis
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

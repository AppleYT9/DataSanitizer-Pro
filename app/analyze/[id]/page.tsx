"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { 
  BarChart3, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Database,
  ArrowRight,
  Wand2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnProfileCard } from "@/components/analyze/column-profile"
import { MissingValueHeatmap } from "@/components/analyze/visualizations/missing-value-heatmap"
import { CorrelationMatrix } from "@/components/analyze/visualizations/correlation-matrix"
import { DistributionHistogram } from "@/components/analyze/visualizations/distribution-histogram"
import { OutlierBoxplot } from "@/components/analyze/visualizations/outlier-boxplot"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function AnalyzePage() {
  const params = useParams()
  const [dataset, setDataset] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!params.id) return

      try {
        const response = await fetch(`/api/dataset/${params.id}`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Dataset not found")
        }
        const data = await response.json()
        setDataset(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Profiling Dataset...</p>
        </div>
      </div>
    )
  }

  if (error || !dataset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Error Loading Dataset</CardTitle>
            <CardDescription>{error || "Unknown error"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/upload">Return to Upload</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = dataset.profile
  const qualityScore = profile?.qualityScore ?? 0
  const columns = profile?.columns ?? []

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                <Database className="h-4 w-4" />
                <span>Dataset Profile</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{dataset.fileName}</h1>
              <p className="text-muted-foreground mt-1">
                Analyzed on {new Date(dataset.uploadedAt).toLocaleDateString()} • {(profile?.totalRows ?? dataset.totalRows ?? 0).toLocaleString()} rows • {(profile?.totalColumns ?? 0)} columns
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Button variant="outline" asChild>
                <Link href="/upload">New Upload</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 group">
                <Link href={`/results/${params.id}`} className="flex items-center gap-2">
                  Apply AI Cleaning
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Quick Stats */}
            <Card className="lg:col-span-2 border-border shadow-sm bg-card overflow-hidden">
              <div className="h-1.5 w-full bg-primary/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${qualityScore}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Health Index</CardTitle>
                  <CardDescription>Overall quality of your dataset</CardDescription>
                </div>
                <div className="text-4xl font-bold text-primary">{qualityScore}%</div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Missing Values</p>
                    <p className="text-2xl font-bold">{(profile?.totalMissing ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Duplicates</p>
                    <p className="text-2xl font-bold">{(profile?.duplicateRows ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Storage Size</p>
                    <p className="text-2xl font-bold">{(dataset.fileSize / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Columns</p>
                    <p className="text-2xl font-bold">{columns.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Summary */}
            <Card className="border-primary/10 shadow-lg shadow-primary/5 bg-primary/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Wand2 className="h-4 w-4" />
                  <span>AI Insights</span>
                </div>
                <CardTitle className="text-lg">Issues Detected</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.issues && profile.issues.length > 0 ? (
                  profile.issues.slice(0, 3).map((issue: any) => (
                    <div key={issue.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-border/50">
                      {issue.severity === "high" ? (
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      ) : issue.severity === "medium" ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-semibold capitalize">{issue.type.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground">{issue.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-border/50">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">No Major Issues</p>
                      <p className="text-xs text-muted-foreground">Your dataset looks clean!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Column Details */}
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Column Details</h2>
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="summary">Statistical Summary</TabsTrigger>
                <TabsTrigger value="visuals">Visualizations</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {columns.map((col: any, index: number) => (
                  <motion.div
                    key={col.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ColumnProfileCard column={col} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Column</th>
                          <th className="px-6 py-4 font-semibold">Type</th>
                          <th className="px-6 py-4 font-semibold">Missing</th>
                          <th className="px-6 py-4 font-semibold">Unique</th>
                          <th className="px-6 py-4 font-semibold">Mean</th>
                          <th className="px-6 py-4 font-semibold">Min/Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {columns.map((col: any) => (
                          <tr key={col.name} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4 font-medium">{col.name}</td>
                            <td className="px-6 py-4">
                              <Badge variant="secondary" className="capitalize">{col.type}</Badge>
                            </td>
                            <td className="px-6 py-4">{col.missingCount}</td>
                            <td className="px-6 py-4">{col.uniqueCount}</td>
                            <td className="px-6 py-4 font-mono text-xs">{col.mean?.toFixed(2) || "N/A"}</td>
                            <td className="px-6 py-4 font-mono text-xs">
                              {col.min !== undefined ? `${col.min} / ${col.max}` : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visuals" className="mt-0 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MissingValueHeatmap 
                  headers={dataset.headers} 
                  rows={dataset.rows} 
                />
                <CorrelationMatrix 
                  headers={dataset.headers} 
                  rows={dataset.rows} 
                  columns={columns}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DistributionHistogram 
                  headers={dataset.headers} 
                  rows={dataset.rows} 
                  columns={columns}
                />
                <OutlierBoxplot 
                  headers={dataset.headers} 
                  rows={dataset.rows} 
                  columns={columns}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

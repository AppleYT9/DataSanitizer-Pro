"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  ArrowLeft, 
  RefreshCcw, 
  Zap,
  Filter,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Leaf
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ResultsPage() {
  const params = useParams()
  const [dataset, setDataset] = useState<any>(null)
  const [cleaningResult, setCleaningResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAndClean() {
      try {
        // First fetch the dataset to get the profile and selected actions
        const datasetRes = await fetch(`/api/dataset/${params.id}`)
        if (!datasetRes.ok) throw new Error("Dataset not found")
        const datasetData = await datasetRes.json()
        setDataset(datasetData)

        // If already cleaned, use existing result
        if (datasetData.cleaningResult) {
          setCleaningResult(datasetData.cleaningResult)
          setLoading(false)
          return
        }

        // If we have selected actions, perform cleaning via POST
        if (datasetData.selectedActions && datasetData.selectedActions.length > 0) {
          const cleanRes = await fetch("/api/clean", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              datasetId: params.id,
              actions: datasetData.selectedActions,
            }),
          })

          if (!cleanRes.ok) throw new Error("Cleaning failed")
          const cleanData = await cleanRes.json()
          setCleaningResult(cleanData.result)
        } else {
          // No actions needed
          setCleaningResult({
            originalRows: datasetData.totalRows || 0,
            cleanedRows: datasetData.totalRows || 0,
            issuesFixed: 0,
            actionsApplied: [],
            changes: [],
          })
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAndClean()
  }, [params.id])

  const handleDownload = async (type: "cleaned" | "report") => {
    try {
      const res = await fetch(`/api/download?id=${params.id}&type=${type}`)
      if (!res.ok) throw new Error("Download failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = type === "cleaned" 
        ? `${dataset?.fileName?.replace(/\.[^.]+$/, "") || "data"}_cleaned.csv`
        : `${dataset?.fileName?.replace(/\.[^.]+$/, "") || "data"}_report.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full p-8 text-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Cleaning Dataset...</h2>
            <p className="text-muted-foreground">Our AI is analyzing patterns and removing inconsistencies.</p>
          </div>
          <Progress value={65} className="h-2 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Cleaning Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/analyze/${params.id}`}>Back to Analysis</Link>
            </Button>
            <Button className="flex-1" onClick={() => window.location.reload()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const duplicatesRemoved = cleaningResult?.actionsApplied?.filter((a: any) => a.type === "remove_duplicates").length > 0
    ? (cleaningResult.originalRows - cleaningResult.cleanedRows) 
    : 0
  const missingValuesHandled = cleaningResult?.changes?.filter((c: any) => c.action?.includes("Fill missing")).length || 0
  const totalFixed = cleaningResult?.issuesFixed || 0
  const actionsApplied = cleaningResult?.actionsApplied || []

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <Link href={`/analyze/${params.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Optimization Report</h1>
              <p className="text-muted-foreground mt-1">
                {dataset?.fileName ? `${dataset.fileName} — ` : ""}Your data is now clean, consistent, and ready for use.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Re-run AI
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={() => handleDownload("cleaned")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Cleaned Data
              </Button>
            </div>
          </div>

          {/* Impact Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
              <CardHeader className="pb-2">
                <CardDescription className="text-primary-foreground/70">Issues Fixed</CardDescription>
                <CardTitle className="text-4xl font-bold">{totalFixed}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90">Data quality actions applied by Data Sanitizer Pro.</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Rows Processed</CardDescription>
                <CardTitle className="text-4xl font-bold">
                  {cleaningResult?.originalRows?.toLocaleString() || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {cleaningResult?.cleanedRows?.toLocaleString() || 0} rows after cleaning.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Quality Score</CardDescription>
                <CardTitle className="text-4xl font-bold">
                  {dataset?.profile?.qualityScore ?? "N/A"}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Dataset quality before cleaning.</p>
              </CardContent>
            </Card>
          </div>

          {/* Transformation Details */}
          <h2 className="text-xl font-bold mb-6">Cleaning Transformations</h2>
          
          {actionsApplied.length === 0 ? (
            <Card className="border-border shadow-sm">
              <CardContent className="flex items-center gap-4 p-6">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-bold">No Cleaning Needed</h3>
                  <p className="text-sm text-muted-foreground">Your dataset was already clean — no transformations were required.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {actionsApplied.map((action: any, index: number) => {
                const iconMap: Record<string, { icon: any; color: string; bg: string }> = {
                  remove_duplicates: { icon: Trash2, color: "text-amber-500", bg: "bg-amber-500/10" },
                  fill_missing: { icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
                  remove_missing: { icon: Trash2, color: "text-red-500", bg: "bg-red-500/10" },
                  fix_case: { icon: Filter, color: "text-purple-500", bg: "bg-purple-500/10" },
                  convert_type: { icon: Filter, color: "text-primary", bg: "bg-primary/10" },
                  cap_outliers: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" },
                  remove_outliers: { icon: Trash2, color: "text-orange-500", bg: "bg-orange-500/10" },
                  scale: { icon: Zap, color: "text-cyan-500", bg: "bg-cyan-500/10" },
                  encode: { icon: Filter, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                }
                const style = iconMap[action.type] || { icon: Zap, color: "text-primary", bg: "bg-primary/10" }
                const Icon = style.icon

                return (
                  <motion.div 
                    key={action.id || index} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border shadow-sm hover:border-primary/20 transition-colors">
                      <CardContent className="flex items-center gap-6 p-6">
                        <div className={`h-12 w-12 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`h-6 w-6 ${style.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold capitalize">{action.type.replace(/_/g, " ")}</h3>
                            <Badge variant="secondary" className={`${style.bg} ${style.color} border-none`}>Completed</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                            {action.column ? ` (Column: ${action.column})` : ""}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 p-8 rounded-3xl bg-secondary/30 border border-dashed border-border">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <div className="text-center">
              <h3 className="text-xl font-bold">Your dataset is ready</h3>
              <p className="text-muted-foreground">Download the cleaned CSV or the full processing report below.</p>
            </div>
            <div className="flex gap-4 mt-2">
              <Button size="lg" className="rounded-full px-8" onClick={() => handleDownload("cleaned")}>
                <Download className="mr-2 h-4 w-4" />
                Cleaned CSV
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8" onClick={() => handleDownload("report")}>
                <FileText className="mr-2 h-4 w-4" />
                Full Report
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import React from "react"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileSpreadsheet, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

const MAX_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_TYPES = [".csv", ".xlsx", ".xls"]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploader({ 
  onFileChange, 
  externalFile 
}: { 
  onFileChange?: (file: File | null) => void,
  externalFile?: File | null
}) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Sync with external file if provided
  React.useEffect(() => {
    if (externalFile !== undefined) {
      setFile(externalFile)
    }
  }, [externalFile])

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((f: File): string | null => {
    const ext = `.${f.name.split(".").pop()?.toLowerCase()}`
    if (!ACCEPTED_TYPES.includes(ext)) {
      return "Invalid file type. Please upload a CSV or Excel file."
    }
    if (f.size > MAX_SIZE) {
      return `File too large (${formatSize(f.size)}). Maximum size is 50MB.`
    }
    if (f.size === 0) {
      return "File is empty."
    }
    return null
  }, [])

  const handleFile = useCallback(
    (f: File) => {
      setError(null)
      const err = validateFile(f)
      if (err) {
        setError(err)
        return
      }
      setFile(f)
      onFileChange?.(f)
    },
    [validateFile, onFileChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) handleFile(droppedFile)
    },
    [handleFile]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) handleFile(selected)
    },
    [handleFile]
  )

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setProgress(10)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      setProgress(30)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      setProgress(70)

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setProgress(100)
      toast.success("Dataset uploaded and profiled successfully!")

      // Navigate to the analysis page
      setTimeout(() => {
        router.push(`/analyze/${data.id}`)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    onFileChange?.(null)
    setError(null)
    setProgress(0)
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <Card
        className={`relative cursor-pointer border-2 border-dashed transition-colors ${isDragging
          ? "border-primary bg-primary/5"
          : file
            ? "border-primary/40 bg-card"
            : "border-border bg-card hover:border-muted-foreground/30"
          }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!file && !uploading) {
            document.getElementById("file-input")?.click()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload file drop zone"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            document.getElementById("file-input")?.click()
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleInputChange}
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center p-12 text-center">
          {file ? (
            <div className="flex w-full max-w-md items-center gap-4 rounded-lg border border-border bg-secondary p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              {!uploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 text-lg font-medium text-foreground">
                {isDragging ? "Drop your file here" : "Drag & drop your dataset"}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                or click to browse. Supports CSV and Excel files up to 50MB.
              </p>
            </>
          )}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing dataset...</span>
            <span className="font-mono text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Action button */}
      {file && !uploading && (
        <Button onClick={handleUpload} className="w-full h-12 text-base" size="lg">
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze & Profile Dataset
        </Button>
      )}

      {uploading && (
        <Button disabled className="w-full h-12 text-base" size="lg">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </Button>
      )}
    </div>
  )
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}

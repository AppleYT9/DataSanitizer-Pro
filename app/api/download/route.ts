import { NextResponse } from "next/server"
import { toCSV } from "@/lib/data-processor"
import { getDataset } from "@/lib/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datasetId = searchParams.get("id")
  const type = searchParams.get("type") || "cleaned" // "cleaned" or "report"

  if (!datasetId) {
    return NextResponse.json({ error: "Dataset ID required" }, { status: 400 })
  }

  const dataset = getDataset(datasetId)
  if (!dataset) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
  }

  if (type === "cleaned") {
    const headers = dataset.cleanedHeaders || dataset.headers
    const rows = dataset.cleanedRows || dataset.rows
    const csv = toCSV(headers, rows)

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${dataset.fileName.replace(/\.[^.]+$/, "")}_cleaned.csv"`,
      },
    })
  }

  if (type === "report") {
    const result = dataset.cleaningResult
    const profile = dataset.profile

    const reportLines = [
      "Data Sanitizer Pro - Data Quality Report",
      "=====================================",
      "",
      `File: ${dataset.fileName}`,
      `Date: ${new Date().toISOString()}`,
      "",
      "--- Original Dataset ---",
      `Rows: ${profile?.totalRows || 0}`,
      `Columns: ${profile?.totalColumns || 0}`,
      `Quality Score: ${profile?.qualityScore || 0}/100`,
      `Total Missing Values: ${profile?.totalMissing || 0} (${profile?.totalMissingPercent || 0}%)`,
      `Duplicate Rows: ${profile?.duplicateRows || 0}`,
      "",
      "--- Issues Detected ---",
      ...(profile?.issues.map(
        (i, idx) => `${idx + 1}. [${i.severity.toUpperCase()}] ${i.description}`
      ) || []),
      "",
      "--- Cleaning Actions Applied ---",
      ...(result?.actionsApplied.map(
        (a, idx) => `${idx + 1}. ${a.description}${a.column ? ` (Column: ${a.column})` : ""}`
      ) || []),
      "",
      "--- Result ---",
      `Original Rows: ${result?.originalRows || 0}`,
      `Cleaned Rows: ${result?.cleanedRows || 0}`,
      `Rows Removed: ${(result?.originalRows || 0) - (result?.cleanedRows || 0)}`,
      `Issues Fixed: ${result?.issuesFixed || 0}`,
      "",
      "--- Column Summary ---",
      ...(profile?.columns.map(
        (c) => `${c.name}: type=${c.type}, missing=${c.missingCount}, unique=${c.uniqueCount}${c.outlierCount ? `, outliers=${c.outlierCount}` : ""}`
      ) || []),
    ]

    return new NextResponse(reportLines.join("\n"), {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${dataset.fileName.replace(/\.[^.]+$/, "")}_report.txt"`,
      },
    })
  }

  return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
}

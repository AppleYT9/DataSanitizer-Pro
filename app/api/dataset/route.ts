import { NextResponse } from "next/server"
import { getAllDatasets } from "@/lib/store"

export async function GET() {
  const datasets = getAllDatasets()
  return NextResponse.json(datasets.map(d => ({
    id: d.id,
    fileName: d.fileName,
    fileSize: d.fileSize,
    status: d.status,
    uploadedAt: d.uploadedAt,
    qualityScore: d.profile?.qualityScore,
    totalRows: d.rows.length,
    totalColumns: d.headers.length
  })))
}

import { NextResponse } from "next/server"
import { getDataset } from "@/lib/store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const dataset = getDataset(id)
  console.log(`[API] Fetching dataset ${id}. Found: ${!!dataset}`)
  
  if (!dataset) {
    return NextResponse.json({ error: `Dataset ${id} not found. The server may have restarted.` }, { status: 404 })
  }

  return NextResponse.json({
    id: dataset.id,
    fileName: dataset.fileName,
    fileSize: dataset.fileSize,
    status: dataset.status,
    headers: dataset.headers,
    rows: dataset.rows.slice(0, 200),
    totalRows: dataset.rows.length,
    profile: dataset.profile,
    selectedActions: dataset.selectedActions,
    cleanedHeaders: dataset.cleanedHeaders,
    cleanedRows: dataset.cleanedRows?.slice(0, 200) || null,
    cleanedTotalRows: dataset.cleanedRows?.length || null,
    cleaningResult: dataset.cleaningResult,
    uploadedAt: dataset.uploadedAt,
  })
}

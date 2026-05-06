import { NextResponse } from "next/server"
import { cleanDataset } from "@/lib/data-processor"
import { getDataset, setDataset } from "@/lib/store"
import type { CleaningAction } from "@/lib/data-processor"

export async function POST(request: Request) {
  try {
    const { datasetId, actions } = (await request.json()) as {
      datasetId: string
      actions: CleaningAction[]
    }

    const dataset = getDataset(datasetId)
    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    if (!actions || actions.length === 0) {
      return NextResponse.json({ error: "No cleaning actions provided" }, { status: 400 })
    }

    dataset.status = "cleaning"
    setDataset(dataset)

    const { headers, rows, result } = cleanDataset(dataset.headers, dataset.rows, actions)

    dataset.cleanedHeaders = headers
    dataset.cleanedRows = rows
    dataset.cleaningResult = result
    dataset.selectedActions = actions
    dataset.status = "cleaned"
    setDataset(dataset)

    return NextResponse.json({
      result,
      cleanedPreview: {
        headers,
        rows: rows.slice(0, 100),
        totalRows: rows.length,
      },
    })
  } catch (error) {
    console.error("Clean error:", error)
    return NextResponse.json({ error: "Failed to clean dataset" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { parseCSV, profileDataset } from "@/lib/data-processor"
import { setDataset, generateId } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!validTypes.includes(file.type) && !["csv", "xlsx", "xls"].includes(ext || "")) {
      return NextResponse.json({ error: "Invalid file type. Please upload CSV or Excel files." }, { status: 400 })
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 })
    }

    const text = await file.text()
    const { headers, rows } = parseCSV(text)

    if (headers.length === 0 || rows.length === 0) {
      return NextResponse.json({ error: "File is empty or has no data rows." }, { status: 400 })
    }

    // Ensure all rows have the same number of columns
    const normalizedRows = rows.map((row) => {
      if (row.length < headers.length) {
        return [...row, ...Array(headers.length - row.length).fill("")]
      }
      return row.slice(0, headers.length)
    })

    const id = generateId()

    // Profile the dataset
    const profile = profileDataset(headers, normalizedRows)

    // Auto-select recommended actions
    const selectedActions = profile.issues.map((issue) => issue.recommendation)

    setDataset({
      id,
      fileName: file.name,
      fileSize: file.size,
      headers,
      rows: normalizedRows,
      profile,
      selectedActions,
      cleanedHeaders: null,
      cleanedRows: null,
      cleaningResult: null,
      status: "profiled",
      uploadedAt: Date.now(),
    })

    return NextResponse.json({
      id,
      fileName: file.name,
      fileSize: file.size,
      totalRows: normalizedRows.length,
      totalColumns: headers.length,
      profile,
      selectedActions,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process file. Ensure it is a valid CSV." }, { status: 500 })
  }
}

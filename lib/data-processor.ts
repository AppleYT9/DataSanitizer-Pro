// Core data processing types and utilities

export interface ColumnProfile {
  name: string
  type: "string" | "number" | "date" | "boolean" | "mixed" | "categorical" | "continuous" | "binary" | "text" | "timestamp"
  semanticType?: "email" | "phone" | "url" | "country" | "currency" | "id" | "name" | "address"
  totalCount: number
  missingCount: number
  missingPercent: number
  uniqueCount: number
  uniquePercent: number
  duplicateCount: number
  topValues: { value: string; count: number }[]
  // Numeric stats
  mean?: number
  median?: number
  min?: number
  max?: number
  stdDev?: number
  outlierCount?: number
  outlierIndices?: number[]
  skewness?: number
  // String stats
  avgLength?: number
  minLength?: number
  maxLength?: number
  inconsistentCaseCount?: number
  inconsistentFormats?: string[]
}

export interface DatasetProfile {
  totalRows: number
  totalColumns: number
  duplicateRows: number
  duplicateRowIndices: number[]
  totalMissing: number
  totalMissingPercent: number
  columns: ColumnProfile[]
  qualityScore: number
  mlReadinessScore: number
  issues: DataIssue[]
}

export interface DataIssue {
  id: string
  type: "missing" | "duplicate" | "outlier" | "type_mismatch" | "inconsistent_format" | "inconsistent_case"
  severity: "high" | "medium" | "low"
  column?: string
  description: string
  affectedRows: number
  recommendation: CleaningAction
}

export interface CleaningAction {
  id: string
  type: "remove_duplicates" | "fill_missing" | "remove_missing" | "fix_case" | "convert_type" | "remove_outliers" | "cap_outliers" | "scale" | "encode"
  column?: string
  strategy?: string
  description: string
  params?: Record<string, unknown>
}

export interface CleaningResult {
  originalRows: number
  cleanedRows: number
  issuesFixed: number
  actionsApplied: CleaningAction[]
  changes: ChangeRecord[]
}

export interface ChangeRecord {
  row: number
  column: string
  oldValue: string
  newValue: string
  action: string
}

// Parse CSV text into structured data
export function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return { headers: [], rows: [] }

  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(parseCSVLine)

  return { headers, rows }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

// Detect column type with more granularity
function detectType(values: string[]): ColumnProfile["type"] {
  const nonEmpty = values.filter((v) => v.trim() !== "")
  if (nonEmpty.length === 0) return "string"

  let numCount = 0
  let dateCount = 0
  let boolCount = 0

  for (const v of nonEmpty) {
    if (!Number.isNaN(Number(v))) numCount++
    else if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(v) || /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(v)) dateCount++
    else if (["true", "false", "yes", "no", "1", "0"].includes(v.toLowerCase())) boolCount++
  }

  const threshold = nonEmpty.length * 0.8
  const uniqueCount = new Set(nonEmpty).size
  const uniquePercent = uniqueCount / nonEmpty.length

  if (boolCount >= threshold || (uniqueCount <= 2 && nonEmpty.length > 5)) return "binary"
  if (dateCount >= threshold) return "timestamp"
  if (numCount >= threshold) {
    return uniquePercent < 0.05 && uniqueCount < 20 ? "categorical" : "continuous"
  }
  if (uniquePercent < 0.1 && uniqueCount < 50) return "categorical"
  
  // Check for long text
  const avgLen = nonEmpty.reduce((a, b) => a + b.length, 0) / nonEmpty.length
  if (avgLen > 50) return "text"

  if (numCount > 0 && numCount < threshold && numCount > nonEmpty.length * 0.3) return "mixed"
  return "string"
}

// Semantic detection logic
function detectSemanticType(name: string, values: string[]): ColumnProfile["semanticType"] | undefined {
  const n = name.toLowerCase()
  const nonEmpty = values.filter(v => v.trim() !== "").slice(0, 50)
  
  if (n.includes("email") || nonEmpty.some(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) return "email"
  if (n.includes("phone") || n.includes("mobile") || nonEmpty.some(v => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v))) return "phone"
  if (n.includes("url") || n.includes("website") || nonEmpty.some(v => /^https?:\/\/\S+$/.test(v))) return "url"
  if (n.includes("currency") || n.includes("price") || n.includes("amount") || nonEmpty.some(v => /^[\$€£¥]/.test(v))) return "currency"
  if (n.includes("id") || n.includes("pk") || n.includes("uuid") || (new Set(values).size === values.length && values.length > 10)) return "id"
  if (n.includes("country") || n.includes("nation")) return "country"
  if (n.includes("name") || n.includes("firstname") || n.includes("lastname")) return "name"
  if (n.includes("address") || n.includes("street") || n.includes("city")) return "address"
  
  return undefined
}

// Calculate statistics for numeric columns
function calcNumericStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  if (n === 0) return {}

  const mean = sorted.reduce((a, b) => a + b, 0) / n
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
  const variance = sorted.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n
  const stdDev = Math.sqrt(variance)

  // IQR outlier detection
  const q1 = sorted[Math.floor(n * 0.25)]
  const q3 = sorted[Math.floor(n * 0.75)]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  const outlierIndices: number[] = []
  values.forEach((v, i) => {
    if (v < lowerBound || v > upperBound) outlierIndices.push(i)
  })

  return {
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    min: sorted[0],
    max: sorted[n - 1],
    stdDev: Math.round(stdDev * 100) / 100,
    outlierCount: outlierIndices.length,
    outlierIndices,
  }
}

// Detect duplicate rows
function findDuplicateRows(rows: string[][]): number[] {
  const seen = new Map<string, number>()
  const duplicates: number[] = []

  for (let i = 0; i < rows.length; i++) {
    const key = rows[i].join("|||")
    if (seen.has(key)) {
      duplicates.push(i)
    } else {
      seen.set(key, i)
    }
  }
  return duplicates
}

// Profile a dataset
export function profileDataset(headers: string[], rows: string[][]): DatasetProfile {
  const duplicateRowIndices = findDuplicateRows(rows)
  const columns: ColumnProfile[] = []
  const issues: DataIssue[] = []

  for (let col = 0; col < headers.length; col++) {
    const values = rows.map((r) => r[col] || "")
    const nonEmpty = values.filter((v) => v.trim() !== "")
    const missingCount = values.length - nonEmpty.length
    const type = detectType(values)
    const semanticType = detectSemanticType(headers[col], values)

    // Count unique values
    const uniqueValues = new Set(nonEmpty)

    // Top values
    const valueCounts = new Map<string, number>()
    for (const v of nonEmpty) {
      valueCounts.set(v, (valueCounts.get(v) || 0) + 1)
    }
    const topValues = [...valueCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value, count]) => ({ value, count }))

    const profile: ColumnProfile = {
      name: headers[col],
      type,
      semanticType,
      totalCount: values.length,
      missingCount,
      missingPercent: Math.round((missingCount / values.length) * 10000) / 100,
      uniqueCount: uniqueValues.size,
      uniquePercent: Math.round((uniqueValues.size / Math.max(nonEmpty.length, 1)) * 10000) / 100,
      duplicateCount: nonEmpty.length - uniqueValues.size,
      topValues,
    }

    // Numeric stats
    const isNumericType = type === "continuous" || type === "categorical" || type === "binary"
    if (isNumericType) {
      const numericValues = nonEmpty.map(Number).filter((n) => !Number.isNaN(n))
      const stats = calcNumericStats(numericValues)
      Object.assign(profile, stats)
    }

    // String stats & case inconsistency detection
    const isStringType = type === "string" || type === "text" || type === "categorical"
    if (isStringType && !isNumericType && nonEmpty.length > 0) {
      const lengths = nonEmpty.map((v) => v.length)
      profile.avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
      profile.minLength = Math.min(...lengths)
      profile.maxLength = Math.max(...lengths)

      // Check for case inconsistencies
      const lowered = new Map<string, Set<string>>()
      for (const v of nonEmpty) {
        const key = v.toLowerCase().trim()
        if (!lowered.has(key)) lowered.set(key, new Set())
        lowered.get(key)!.add(v)
      }
      let caseIssues = 0
      const formats: string[] = []
      for (const [, variants] of lowered) {
        if (variants.size > 1) {
          caseIssues += variants.size - 1
          formats.push([...variants].join(" / "))
        }
      }
      profile.inconsistentCaseCount = caseIssues
      profile.inconsistentFormats = formats.slice(0, 5)
    }

    columns.push(profile)

    // Generate issues
    if (missingCount > 0) {
      issues.push({
        id: `missing-${headers[col]}`,
        type: "missing",
        severity: missingCount / values.length > 0.4 ? "high" : missingCount / values.length > 0.1 ? "medium" : "low",
        column: headers[col],
        description: `${missingCount} missing values (${profile.missingPercent}%) in "${headers[col]}"`,
        affectedRows: missingCount,
        recommendation: {
          id: `fix-missing-${headers[col]}`,
          type: missingCount / values.length > 0.7 ? "remove_missing" : "fill_missing",
          column: headers[col],
          strategy: type === "continuous" ? "median" : "mode",
          description: missingCount / values.length > 0.7 
            ? `Extremely high missing rate (${profile.missingPercent}%). Consider removing this column.`
            : type === "continuous"
              ? `Fill missing values with median (${profile.median})`
              : `Fill missing values with most frequent value`,
        },
      })
    }

    if (profile.uniquePercent > 95 && profile.totalCount > 20 && type === "string" && !semanticType) {
      issues.push({
        id: `high-cardinality-${headers[col]}`,
        type: "type_mismatch", // Reusing type for now or could add new
        severity: "low",
        column: headers[col],
        description: `High cardinality detected in "${headers[col]}" (${profile.uniqueCount} unique values)`,
        affectedRows: profile.uniqueCount,
        recommendation: {
          id: `fix-cardinality-${headers[col]}`,
          type: "convert_type",
          column: headers[col],
          description: "This looks like an Identifier or unique Name column. Consider excluding it from ML models.",
        },
      })
    }

    if (profile.outlierCount && profile.outlierCount > 0) {
      issues.push({
        id: `outlier-${headers[col]}`,
        type: "outlier",
        severity: profile.outlierCount / values.length > 0.1 ? "high" : "medium",
        column: headers[col],
        description: `${profile.outlierCount} outlier(s) detected in "${headers[col]}"`,
        affectedRows: profile.outlierCount,
        recommendation: {
          id: `fix-outlier-${headers[col]}`,
          type: "cap_outliers",
          column: headers[col],
          strategy: "iqr",
          description: "Cap outlier values using IQR bounds",
        },
      })
    }

    if (profile.inconsistentCaseCount && profile.inconsistentCaseCount > 0) {
      issues.push({
        id: `case-${headers[col]}`,
        type: "inconsistent_case",
        severity: "medium",
        column: headers[col],
        description: `${profile.inconsistentCaseCount} inconsistent casing(s) in "${headers[col]}"`,
        affectedRows: profile.inconsistentCaseCount,
        recommendation: {
          id: `fix-case-${headers[col]}`,
          type: "fix_case",
          column: headers[col],
          strategy: "title_case",
          description: "Standardize text casing to title case",
        },
      })
    }

    if (type === "mixed") {
      issues.push({
        id: `type-${headers[col]}`,
        type: "type_mismatch",
        severity: "high",
        column: headers[col],
        description: `Mixed data types detected in "${headers[col]}"`,
        affectedRows: values.length,
        recommendation: {
          id: `fix-type-${headers[col]}`,
          type: "convert_type",
          column: headers[col],
          strategy: "to_number",
          description: "Convert compatible values to numbers, set others as missing",
        },
      })
    }
  }

  if (duplicateRowIndices.length > 0) {
    issues.unshift({
      id: "duplicate-rows",
      type: "duplicate",
      severity: duplicateRowIndices.length / rows.length > 0.1 ? "high" : "medium",
      description: `${duplicateRowIndices.length} duplicate row(s) found`,
      affectedRows: duplicateRowIndices.length,
      recommendation: {
        id: "fix-duplicates",
        type: "remove_duplicates",
        description: "Remove duplicate rows, keeping the first occurrence",
      },
    })
  }

  // Sort issues by severity
  const severityOrder = { high: 0, medium: 1, low: 2 }
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  // Calculate quality score
  const totalCells = rows.length * headers.length
  const totalMissing = columns.reduce((s, c) => s + c.missingCount, 0)
  const totalOutliers = columns.reduce((s, c) => s + (c.outlierCount || 0), 0)
  const mixedCols = columns.filter((c) => c.type === "mixed").length
  const caseIssues = columns.reduce((s, c) => s + (c.inconsistentCaseCount || 0), 0)

  const missingPenalty = (totalMissing / totalCells) * 40
  const duplicatePenalty = (duplicateRowIndices.length / rows.length) * 20
  const outlierPenalty = (totalOutliers / totalCells) * 15
  const typePenalty = (mixedCols / headers.length) * 15
  const casePenalty = Math.min((caseIssues / totalCells) * 10, 10)

  const qualityScore = Math.max(0, Math.round(100 - missingPenalty - duplicatePenalty - outlierPenalty - typePenalty - casePenalty))

  // Pre-calculate totalMissingPercent before ML score uses it
  const totalMissingPercent = Math.round((totalMissing / totalCells) * 10000) / 100

  // Calculate ML Readiness Score
  const categoricalCols = columns.filter(c => c.type === "categorical").length
  const continuousCols = columns.filter(c => c.type === "continuous").length
  const mixedColsCount = columns.filter(c => c.type === "mixed").length
  
  let mlScore = qualityScore * 0.6 // Quality is 60% of ML readiness
  if (categoricalCols + continuousCols > 0) mlScore += 20
  if (mixedColsCount === 0) mlScore += 10
  if (totalMissingPercent < 5) mlScore += 10
  
  const mlReadinessScore = Math.min(100, Math.max(0, Math.round(mlScore)))

  return {
    totalRows: rows.length,
    totalColumns: headers.length,
    duplicateRows: duplicateRowIndices.length,
    duplicateRowIndices,
    totalMissing,
    totalMissingPercent,
    columns,
    qualityScore,
    mlReadinessScore,
    issues,
  }
}

// Apply cleaning actions
export function cleanDataset(
  headers: string[],
  rows: string[][],
  actions: CleaningAction[]
): { headers: string[]; rows: string[][]; result: CleaningResult } {
  let currentRows = rows.map((r) => [...r])
  const changes: ChangeRecord[] = []
  const applied: CleaningAction[] = []
  const originalRows = currentRows.length

  for (const action of actions) {
    const colIndex = action.column ? headers.indexOf(action.column) : -1

    switch (action.type) {
      case "remove_duplicates": {
        const seen = new Set<string>()
        const newRows: string[][] = []
        for (const row of currentRows) {
          const key = row.join("|||")
          if (!seen.has(key)) {
            seen.add(key)
            newRows.push(row)
          }
        }
        if (newRows.length < currentRows.length) {
          applied.push(action)
          currentRows = newRows
        }
        break
      }

      case "fill_missing": {
        if (colIndex === -1) break
        const values = currentRows.map((r) => r[colIndex]).filter((v) => v.trim() !== "")

        let fillValue = ""
        if (action.strategy === "mean" || action.strategy === "median") {
          const nums = values.map(Number).filter((n) => !Number.isNaN(n))
          if (nums.length > 0) {
            if (action.strategy === "mean") {
              fillValue = String(Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100)
            } else {
              const sorted = [...nums].sort((a, b) => a - b)
              const mid = Math.floor(sorted.length / 2)
              fillValue = String(sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2)
            }
          }
        } else if (action.strategy === "mode") {
          const counts = new Map<string, number>()
          for (const v of values) counts.set(v, (counts.get(v) || 0) + 1)
          let maxCount = 0
          for (const [v, c] of counts) {
            if (c > maxCount) { maxCount = c; fillValue = v }
          }
        }

        if (fillValue) {
          for (let i = 0; i < currentRows.length; i++) {
            if (currentRows[i][colIndex].trim() === "") {
              changes.push({
                row: i,
                column: action.column!,
                oldValue: "",
                newValue: fillValue,
                action: `Fill missing with ${action.strategy} (${fillValue})`,
              })
              currentRows[i][colIndex] = fillValue
            }
          }
          applied.push(action)
        }
        break
      }

      case "remove_missing": {
        if (colIndex === -1) break
        const before = currentRows.length
        currentRows = currentRows.filter((r) => r[colIndex].trim() !== "")
        if (currentRows.length < before) applied.push(action)
        break
      }

      case "fix_case": {
        if (colIndex === -1) break
        for (let i = 0; i < currentRows.length; i++) {
          const old = currentRows[i][colIndex]
          if (old.trim() === "") continue
          let newVal = old
          if (action.strategy === "title_case") {
            newVal = old.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
          } else if (action.strategy === "lower_case") {
            newVal = old.toLowerCase()
          } else if (action.strategy === "upper_case") {
            newVal = old.toUpperCase()
          }
          if (newVal !== old) {
            changes.push({ row: i, column: action.column!, oldValue: old, newValue: newVal, action: "Standardize casing" })
            currentRows[i][colIndex] = newVal
          }
        }
        applied.push(action)
        break
      }

      case "convert_type": {
        if (colIndex === -1) break
        for (let i = 0; i < currentRows.length; i++) {
          const old = currentRows[i][colIndex]
          if (old.trim() === "") continue
          if (action.strategy === "to_number") {
            const num = Number(old)
            if (!Number.isNaN(num)) {
              const newVal = String(num)
              if (newVal !== old) {
                changes.push({ row: i, column: action.column!, oldValue: old, newValue: newVal, action: "Convert to number" })
                currentRows[i][colIndex] = newVal
              }
            } else {
              changes.push({ row: i, column: action.column!, oldValue: old, newValue: "", action: "Set non-numeric to empty" })
              currentRows[i][colIndex] = ""
            }
          }
        }
        applied.push(action)
        break
      }

      case "cap_outliers": {
        if (colIndex === -1) break
        const nums = currentRows.map((r) => r[colIndex]).filter((v) => v.trim() !== "").map(Number).filter((n) => !Number.isNaN(n))
        if (nums.length === 0) break
        const sorted = [...nums].sort((a, b) => a - b)
        const q1 = sorted[Math.floor(sorted.length * 0.25)]
        const q3 = sorted[Math.floor(sorted.length * 0.75)]
        const iqr = q3 - q1
        const lower = q1 - 1.5 * iqr
        const upper = q3 + 1.5 * iqr

        for (let i = 0; i < currentRows.length; i++) {
          const val = Number(currentRows[i][colIndex])
          if (Number.isNaN(val)) continue
          if (val < lower) {
            changes.push({ row: i, column: action.column!, oldValue: String(val), newValue: String(Math.round(lower * 100) / 100), action: "Cap lower outlier" })
            currentRows[i][colIndex] = String(Math.round(lower * 100) / 100)
          } else if (val > upper) {
            changes.push({ row: i, column: action.column!, oldValue: String(val), newValue: String(Math.round(upper * 100) / 100), action: "Cap upper outlier" })
            currentRows[i][colIndex] = String(Math.round(upper * 100) / 100)
          }
        }
        applied.push(action)
        break
      }

      case "remove_outliers": {
        if (colIndex === -1) break
        const numVals = currentRows.map((r) => r[colIndex]).filter((v) => v.trim() !== "").map(Number).filter((n) => !Number.isNaN(n))
        if (numVals.length === 0) break
        const sortedVals = [...numVals].sort((a, b) => a - b)
        const q1v = sortedVals[Math.floor(sortedVals.length * 0.25)]
        const q3v = sortedVals[Math.floor(sortedVals.length * 0.75)]
        const iqrv = q3v - q1v
        const lo = q1v - 1.5 * iqrv
        const hi = q3v + 1.5 * iqrv
        const before = currentRows.length
        currentRows = currentRows.filter((r) => {
          const val = Number(r[colIndex])
          if (Number.isNaN(val)) return true
          return val >= lo && val <= hi
        })
        if (currentRows.length < before) applied.push(action)
        break
      }

      case "scale": {
        if (colIndex === -1) break
        const nums = currentRows.map((r) => Number(r[colIndex])).filter((n) => !Number.isNaN(n))
        if (nums.length === 0) break
        const min = Math.min(...nums)
        const max = Math.max(...nums)
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length
        const std = Math.sqrt(nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length)

        for (let i = 0; i < currentRows.length; i++) {
          const val = Number(currentRows[i][colIndex])
          if (Number.isNaN(val)) continue
          let newVal = val
          if (action.strategy === "min_max") {
            newVal = max === min ? 0 : (val - min) / (max - min)
          } else if (action.strategy === "standard") {
            newVal = std === 0 ? 0 : (val - mean) / std
          }
          currentRows[i][colIndex] = String(Math.round(newVal * 1000) / 1000)
          changes.push({ row: i, column: action.column!, oldValue: String(val), newValue: currentRows[i][colIndex], action: `Scale (${action.strategy})` })
        }
        applied.push(action)
        break
      }

      case "encode": {
        if (colIndex === -1) break
        if (action.strategy === "label") {
          const uniqueVals = Array.from(new Set(currentRows.map((r) => r[colIndex]))).sort()
          const map = new Map(uniqueVals.map((v, i) => [v, i]))
          for (let i = 0; i < currentRows.length; i++) {
            const old = currentRows[i][colIndex]
            currentRows[i][colIndex] = String(map.get(old))
            changes.push({ row: i, column: action.column!, oldValue: old, newValue: currentRows[i][colIndex], action: "Label encoding" })
          }
        }
        applied.push(action)
        break
      }
    }
  }

  return {
    headers,
    rows: currentRows,
    result: {
      originalRows,
      cleanedRows: currentRows.length,
      issuesFixed: applied.length,
      actionsApplied: applied,
      changes: changes.slice(0, 500), // Limit for display
    },
  }
}

// Generate downloadable CSV
export function toCSV(headers: string[], rows: string[][]): string {
  const escapeField = (f: string) => {
    if (f.includes(",") || f.includes('"') || f.includes("\n")) {
      return `"${f.replace(/"/g, '""')}"`
    }
    return f
  }

  const headerLine = headers.map(escapeField).join(",")
  const dataLines = rows.map((r) => r.map(escapeField).join(","))
  return [headerLine, ...dataLines].join("\n")
}

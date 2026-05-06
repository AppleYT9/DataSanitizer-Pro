"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface DataPreviewTableProps {
  headers: string[]
  rows: string[][]
  totalRows: number
  pageSize?: number
}

export function DataPreviewTable({
  headers,
  rows,
  totalRows,
  pageSize = 20,
}: DataPreviewTableProps) {
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<number | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [search, setSearch] = useState("")

  const filteredRows = useMemo(() => {
    if (!search) return rows
    const lower = search.toLowerCase()
    return rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(lower))
    )
  }, [rows, search])

  const sortedRows = useMemo(() => {
    if (sortCol === null) return filteredRows
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortCol] || ""
      const bVal = b[sortCol] || ""
      const aNum = Number(aVal)
      const bNum = Number(bVal)

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return sortDir === "asc" ? aNum - bNum : bNum - aNum
      }
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    })
  }, [filteredRows, sortCol, sortDir])

  const totalPages = Math.ceil(sortedRows.length / pageSize)
  const pageRows = sortedRows.slice(page * pageSize, (page + 1) * pageSize)

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortCol(colIndex)
      setSortDir("asc")
    }
    setPage(0)
  }

  return (
    <div className="space-y-4">
      {/* Search and info bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {pageRows.length} of {sortedRows.length} rows
          {totalRows > rows.length && (
            <span className="text-muted-foreground/60"> (preview of {rows.length}/{totalRows})</span>
          )}
        </p>
      </div>

      {/* Table */}
      <ScrollArea className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-12 bg-secondary text-center font-mono text-xs text-muted-foreground">
                #
              </TableHead>
              {headers.map((header, i) => (
                <TableHead
                  key={`${header}-${i}`}
                  className="cursor-pointer bg-secondary text-xs font-medium text-foreground whitespace-nowrap hover:text-primary"
                  onClick={() => handleSort(i)}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  className="py-8 text-center text-muted-foreground"
                >
                  No matching rows found.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-border hover:bg-secondary/50">
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {page * pageSize + rowIndex + 1}
                  </TableCell>
                  {headers.map((_, colIndex) => {
                    const val = row[colIndex] || ""
                    const isEmpty = val.trim() === ""

                    return (
                      <TableCell
                        key={`${rowIndex}-${colIndex}`}
                        className={`whitespace-nowrap text-xs ${
                          isEmpty ? "text-destructive/50 italic" : "text-foreground"
                        }`}
                      >
                        {isEmpty ? "(empty)" : val.length > 50 ? `${val.slice(0, 50)}...` : val}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

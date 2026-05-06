"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import type { CleaningAction, DataIssue } from "@/lib/data-processor"
import { cn } from "@/lib/utils"

interface CleaningControlsProps {
  issues: DataIssue[]
  selectedActions: CleaningAction[]
  onActionsChange: (actions: CleaningAction[]) => void
}

const strategyOptions: Record<string, { label: string; value: string }[]> = {
  fill_missing_number: [
    { label: "Median", value: "median" },
    { label: "Mean", value: "mean" },
    { label: "Drop rows", value: "drop" },
  ],
  fill_missing_string: [
    { label: "Mode (most frequent)", value: "mode" },
    { label: "Drop rows", value: "drop" },
  ],
  outlier: [
    { label: "Cap (IQR bounds)", value: "cap" },
    { label: "Remove rows", value: "remove" },
  ],
  case: [
    { label: "Title Case", value: "title_case" },
    { label: "Lower Case", value: "lower_case" },
    { label: "Upper Case", value: "upper_case" },
  ],
}

export function CleaningControls({
  issues,
  selectedActions,
  onActionsChange,
}: CleaningControlsProps) {
  const [expanded] = useState(true)

  const isActionSelected = (actionId: string) =>
    selectedActions.some((a) => a.id === actionId)

  const toggleAction = (issue: DataIssue, enabled: boolean) => {
    if (enabled) {
      onActionsChange([...selectedActions, issue.recommendation])
    } else {
      onActionsChange(selectedActions.filter((a) => a.id !== issue.recommendation.id))
    }
  }

  const updateStrategy = (issue: DataIssue, strategy: string) => {
    const updatedActions = selectedActions.map((a) => {
      if (a.id === issue.recommendation.id) {
        let type = a.type
        let description = a.description

        if (issue.type === "missing") {
          if (strategy === "drop") {
            type = "remove_missing"
            description = `Remove rows with missing values in "${a.column}"`
          } else {
            type = "fill_missing"
            description = `Fill missing values with ${strategy} in "${a.column}"`
          }
        } else if (issue.type === "outlier") {
          type = strategy === "remove" ? "remove_outliers" : "cap_outliers"
          description = strategy === "remove"
            ? `Remove outlier rows in "${a.column}"`
            : `Cap outlier values using IQR bounds in "${a.column}"`
        } else if (issue.type === "inconsistent_case") {
          const caseLabel = strategy.replace("_", " ")
          description = `Standardize text to ${caseLabel} in "${a.column}"`
        }

        return { ...a, strategy, type, description }
      }
      return a
    })
    onActionsChange(updatedActions)
  }

  const getStrategyKey = (issue: DataIssue): string | null => {
    if (issue.type === "missing") {
      const colType = issue.recommendation.strategy === "median" || issue.recommendation.strategy === "mean"
        ? "number"
        : "string"
      return `fill_missing_${colType}`
    }
    if (issue.type === "outlier") return "outlier"
    if (issue.type === "inconsistent_case") return "case"
    return null
  }

  const getCurrentStrategy = (issue: DataIssue): string => {
    const action = selectedActions.find((a) => a.id === issue.recommendation.id)
    if (!action) return issue.recommendation.strategy || ""

    if (issue.type === "missing" && action.type === "remove_missing") return "drop"
    if (issue.type === "outlier" && action.type === "remove_outliers") return "remove"
    if (issue.type === "outlier" && action.type === "cap_outliers") return "cap"
    return action.strategy || ""
  }

  if (issues.length === 0) return null

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Cleaning Actions</CardTitle>
          <Badge variant="outline" className="ml-auto">
            {selectedActions.length} selected
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-recommended actions are pre-selected. Toggle or adjust strategies below.
        </p>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-3">
          {issues.map((issue) => {
            const checked = isActionSelected(issue.recommendation.id)
            const strategyKey = getStrategyKey(issue)
            const options = strategyKey ? strategyOptions[strategyKey] : null
            const currentStrategy = getCurrentStrategy(issue)

            return (
              <div
                key={issue.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                  checked ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/50"
                )}
              >
                <Checkbox
                  id={issue.id}
                  checked={checked}
                  onCheckedChange={(val) => toggleAction(issue, val as boolean)}
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <label htmlFor={issue.id} className="cursor-pointer text-sm text-foreground">
                    {issue.recommendation.description}
                  </label>
                  {checked && options && (
                    <Select
                      value={currentStrategy}
                      onValueChange={(val) => updateStrategy(issue, val)}
                    >
                      <SelectTrigger className="h-8 w-48 text-xs">
                        <SelectValue placeholder="Strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {issue.affectedRows} rows
                </span>
              </div>
            )
          })}
        </CardContent>
      )}
    </Card>
  )
}

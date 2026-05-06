// Simple in-memory store for dataset state management across components
// Uses a reactive pattern with SWR for component synchronization

import type { DatasetProfile, CleaningAction, CleaningResult } from "./data-processor"

export interface DatasetState {
  id: string
  fileName: string
  fileSize: number
  headers: string[]
  rows: string[][]
  profile: DatasetProfile | null
  selectedActions: CleaningAction[]
  cleanedHeaders: string[] | null
  cleanedRows: string[][] | null
  cleaningResult: CleaningResult | null
  status: "uploaded" | "profiling" | "profiled" | "cleaning" | "cleaned"
  uploadedAt: number
}

// In-memory store - shared within the session
// Use global to persist across hot reloads in development
const globalForDatasets = global as unknown as { datasets: Map<string, DatasetState> }
const datasets = globalForDatasets.datasets || new Map<string, DatasetState>()

if (process.env.NODE_ENV !== "production") globalForDatasets.datasets = datasets

export function getDataset(id: string): DatasetState | undefined {
  return datasets.get(id)
}

export function setDataset(state: DatasetState): void {
  datasets.set(state.id, state)
}

export function deleteDataset(id: string): void {
  datasets.delete(id)
}

export function generateId(): string {
  return `ds_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function getAllDatasets(): DatasetState[] {
  return Array.from(datasets.values()).sort((a, b) => b.uploadedAt - a.uploadedAt)
}

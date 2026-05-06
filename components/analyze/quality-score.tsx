"use client"

import { cn } from "@/lib/utils"

interface QualityScoreProps {
  score: number
  size?: number
  title?: string
}

export function QualityScore({ score, size = 140, title = "Quality" }: QualityScoreProps) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 80
      ? "rgb(34, 197, 94)" // success
      : score >= 50
        ? "rgb(234, 179, 8)" // warning
        : "rgb(239, 68, 68)" // destructive

  const label = score >= 80 ? "High" : score >= 50 ? "Medium" : "Low"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider",
          score >= 80 && "bg-green-500/10 text-green-500",
          score >= 50 && score < 80 && "bg-yellow-500/10 text-yellow-500",
          score < 50 && "bg-red-500/10 text-red-500"
        )}
      >
        {label}
      </span>
    </div>
  )
}

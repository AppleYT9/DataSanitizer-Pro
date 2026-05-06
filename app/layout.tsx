import React from "react"
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'Data Sanitizer Pro — Intelligent Dataset Profiling & Cleaning Platform',
  description: 'Upload datasets, detect quality issues, and apply intelligent AI-powered cleaning strategies. Visualize data anomalies, measure ML readiness, and clean your data in minutes.',
}

export const viewport: Viewport = {
  themeColor: '#0d1117',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

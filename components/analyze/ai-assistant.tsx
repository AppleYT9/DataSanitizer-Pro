"use client"

import React, { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import type { DatasetProfile } from "@/lib/data-processor"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface AIAssistantProps {
  profile: DatasetProfile
  fileName: string
}

export function AIAssistant({ profile, fileName }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your Data Sanitizer Pro assistant. I've analyzed **${fileName}**. How can I help you clean or understand this data?`,
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const generateResponse = (userMsg: string) => {
    const msg = userMsg.toLowerCase()

    if (msg.includes("outlier")) {
      const outlierCols = profile.columns.filter(c => (c.outlierCount || 0) > 0)
      if (outlierCols.length > 0) {
        return `I found outliers in ${outlierCols.length} columns: ${outlierCols.map(c => c.name).join(", ")}. I recommend using IQR-based capping to handle them.`
      }
      return "I didn't detect any significant outliers in this dataset."
    }

    if (msg.includes("missing") || msg.includes("null")) {
      if (profile.totalMissing > 0) {
        return `There are ${profile.totalMissing} missing values (${profile.totalMissingPercent}%). The most problematic column is "${profile.columns.sort((a, b) => b.missingCount - a.missingCount)[0].name}".`
      }
      return "Great news! This dataset has no missing values."
    }

    if (msg.includes("quality") || msg.includes("score")) {
      return `The overall Quality Score is ${profile.qualityScore}/100 and ML Readiness is ${profile.mlReadinessScore}/100. ${profile.qualityScore > 80 ? "This is a very clean dataset." : "There's significant cleaning required before ML modeling."}`
    }

    if (msg.includes("type") || msg.includes("semantic")) {
      const semanticCols = profile.columns.filter(c => c.semanticType)
      if (semanticCols.length > 0) {
        return `I've automatically identified these semantic types: ${semanticCols.map(c => `${c.name} (${c.semanticType})`).join(", ")}.`
      }
      return "I've identified the technical types (categorical, continuous, etc.), but no specific semantic types like Email or Phone were detected."
    }

    return "I'm here to help with data cleaning, outlier detection, and profiling. Ask me about missing values, quality scores, or specific columns!"
  }

  const handleSend = () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: "user", content: input } as const]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(input)
      setMessages([...newMessages, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 800)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 animate-bounce"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl z-50 border-primary/20 bg-card overflow-hidden">
          <CardHeader className="bg-primary p-4 text-primary-foreground flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-bold font-heading">Data Sanitizer Pro Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[380px] p-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground border border-border"
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary p-2 rounded-lg border border-border">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-muted/30">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex w-full gap-2"
            >
              <Input
                placeholder="Ask about your data..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

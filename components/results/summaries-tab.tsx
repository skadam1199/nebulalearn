"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, Zap, FileText } from "lucide-react"

type SummaryLength = "90sec" | "5min" | "full"

interface SummaryContent {
  "90sec": string
  "5min": string
  full: string
}

interface SummariesTabProps {
  summaries: SummaryContent
}

export function SummariesTab({ summaries }: SummariesTabProps) {
  const [activeLength, setActiveLength] = useState<SummaryLength>("5min")

  const buttons = [
    { key: "90sec" as const, label: "90 sec", icon: Zap, description: "Quick overview" },
    { key: "5min" as const, label: "5 min", icon: Clock, description: "Detailed summary" },
    { key: "full" as const, label: "Full", icon: FileText, description: "Complete notes" },
  ]

  return (
    <div className="space-y-6">
      {/* Length Selector */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl backdrop-blur-sm">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveLength(btn.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              activeLength === btn.key
                ? "bg-cyan-500 text-background shadow-lg shadow-cyan-500/25"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <btn.icon className="w-4 h-4" />
            <span className="font-medium">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Summary Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLength}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            {buttons.find(b => b.key === activeLength)?.icon && (
              <div className="p-2 rounded-lg bg-cyan-500/10">
                {(() => {
                  const Icon = buttons.find(b => b.key === activeLength)!.icon
                  return <Icon className="w-4 h-4 text-cyan-500" />
                })()}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-foreground">
                {buttons.find(b => b.key === activeLength)?.label} Summary
              </h4>
              <p className="text-xs text-muted-foreground">
                {buttons.find(b => b.key === activeLength)?.description}
              </p>
            </div>
          </div>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {summaries[activeLength]}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

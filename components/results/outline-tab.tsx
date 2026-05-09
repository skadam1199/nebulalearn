"use client"

import { motion } from "framer-motion"
import { FileText, ChevronRight } from "lucide-react"

interface OutlineSection {
  id: string
  title: string
  content: string[]
  timestamp?: number
}

interface OutlineTabProps {
  sections: OutlineSection[]
  onSeek?: (timestamp: number) => void
}

export function OutlineTab({ sections, onSeek }: OutlineTabProps) {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:border-cyan-500/30 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <FileText className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{section.title}</h4>
                {section.timestamp !== undefined && onSeek && (
                  <button
                    onClick={() => onSeek(section.timestamp!)}
                    className="text-xs font-mono px-2 py-1 rounded bg-secondary hover:bg-cyan-500/20 text-muted-foreground hover:text-cyan-400 transition-colors"
                  >
                    {Math.floor(section.timestamp / 60)}:{(section.timestamp % 60).toString().padStart(2, "0")}
                  </button>
                )}
              </div>
              <ul className="mt-2 space-y-1.5">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-3 h-3 mt-1.5 text-cyan-500/60 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

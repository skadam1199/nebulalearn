"use client"

import { motion } from "framer-motion"
import { Clock, ChevronRight } from "lucide-react"

interface OutlineItem {
  id: string
  timestamp: number
  title: string
  isActive?: boolean
}

interface TimestampedOutlineProps {
  items: OutlineItem[]
  currentTime: number
  onSeek: (timestamp: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function TimestampedOutline({ items, currentTime, onSeek }: TimestampedOutlineProps) {
  return (
    <div className="mt-4 space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-cyan-500" />
        Video Outline
      </h3>
      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
        {items.map((item, index) => {
          const isActive = currentTime >= item.timestamp && 
            (items[index + 1] ? currentTime < items[index + 1].timestamp : true)
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSeek(item.timestamp)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                isActive 
                  ? "bg-cyan-500/20 border border-cyan-500/40" 
                  : "hover:bg-secondary/80 border border-transparent"
              }`}
            >
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                isActive 
                  ? "bg-cyan-500 text-background" 
                  : "bg-secondary text-muted-foreground group-hover:bg-cyan-500/20 group-hover:text-cyan-400"
              }`}>
                {formatTime(item.timestamp)}
              </span>
              <span className={`flex-1 text-sm truncate ${
                isActive ? "text-foreground font-medium" : "text-muted-foreground"
              }`}>
                {item.title}
              </span>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                isActive ? "text-cyan-500" : "text-muted-foreground/50 group-hover:translate-x-0.5"
              }`} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search, Clock, ArrowRight } from "lucide-react"

interface SearchResult {
  id: string
  text: string
  timestamp: number
  context: string
}

interface SearchTabProps {
  onSearch: (query: string) => SearchResult[]
  onSeek: (timestamp: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Sample search data for demo
const sampleResults: SearchResult[] = [
  {
    id: "1",
    text: "Neural networks are computational systems inspired by biological neural networks",
    timestamp: 145,
    context: "...the concept of neural networks was first introduced in the 1940s, but only became practical with modern computing power...",
  },
  {
    id: "2",
    text: "Backpropagation is the key algorithm for training neural networks",
    timestamp: 423,
    context: "...using gradient descent, backpropagation adjusts weights by calculating the error contribution of each neuron...",
  },
  {
    id: "3",
    text: "Convolutional Neural Networks excel at image recognition tasks",
    timestamp: 892,
    context: "...CNNs use filters that slide across the input, detecting patterns like edges, textures, and complex shapes...",
  },
]

export function SearchTab({ onSeek }: SearchTabProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.trim().length > 2) {
      // Simulate semantic search - in production this would call your AI backend
      const filtered = sampleResults.filter(
        (r) =>
          r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.context.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered.length > 0 ? filtered : sampleResults.slice(0, 2))
      setHasSearched(true)
    } else {
      setResults([])
      setHasSearched(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search within this video... (try 'neural networks')"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 pr-4 py-6 text-base rounded-xl bg-secondary/50 border-border focus:border-cyan-500 focus:ring-cyan-500/20 placeholder:text-muted-foreground/60"
        />
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>

            {results.map((result, index) => (
              <motion.button
                key={result.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSeek(result.timestamp)}
                className="w-full text-left p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:border-cyan-500/50 hover:bg-card/80 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-mono shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTime(result.timestamp)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground line-clamp-1">{result.text}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.context}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="p-4 rounded-2xl bg-secondary/30 inline-block mb-4">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground">
              Search for any concept mentioned in the video
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Our AI understands context and meaning, not just keywords
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Zap, FileText, Globe, Loader2 } from "lucide-react"

type SummaryLength = "90sec" | "5min" | "full"

interface SummaryContent {
  "90sec": string
  "5min": string
  full: string
}

interface SummariesTabProps {
  summaries: SummaryContent
  apiUrl?: string
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
]

export function SummariesTab({ summaries, apiUrl }: SummariesTabProps) {
  const [activeLength, setActiveLength] = useState<SummaryLength>("5min")
  const [language, setLanguage] = useState("en")
  const [translated, setTranslated] = useState<Partial<SummaryContent>>({})
  const [translating, setTranslating] = useState(false)

  const API_URL = apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const buttons = [
    { key: "90sec" as const, label: "90 sec", icon: Zap, description: "Quick overview" },
    { key: "5min" as const, label: "5 min", icon: Clock, description: "Detailed summary" },
    { key: "full" as const, label: "Full", icon: FileText, description: "Complete notes" },
  ]

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang)
    if (lang === "en") { setTranslated({}); return }
    if (translated["90sec"]) return // already translated

    setTranslating(true)
    try {
      const results = await Promise.all(
        (["90sec", "5min", "full"] as SummaryLength[]).map(async (key) => {
          const res = await fetch(`${API_URL}/api/translate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: summaries[key], language: lang }),
          })
          if (!res.ok) return [key, summaries[key]]
          const data = await res.json()
          return [key, data.translated || summaries[key]]
        })
      )
      setTranslated(Object.fromEntries(results))
    } catch {
      // fallback to English on error
    } finally {
      setTranslating(false)
    }
  }

  const displayContent = language !== "en" && translated[activeLength]
    ? translated[activeLength]!
    : summaries[activeLength]

  return (
    <div className="space-y-6">
      {/* Length + Language row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl backdrop-blur-sm flex-1">
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

        {/* Language selector */}
        <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-xl backdrop-blur-sm">
          <Globe className="w-4 h-4 text-cyan-500 shrink-0" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-sm text-foreground outline-none cursor-pointer"
            disabled={translating}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          {translating && <Loader2 className="w-3 h-3 text-cyan-500 animate-spin" />}
        </div>
      </div>

      {/* Summary Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeLength}-${language}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              {(() => { const Icon = buttons.find(b => b.key === activeLength)!.icon; return <Icon className="w-4 h-4 text-cyan-500" /> })()}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                {buttons.find(b => b.key === activeLength)?.label} Summary
                {language !== "en" && (
                  <span className="ml-2 text-xs font-normal text-cyan-500">
                    · {LANGUAGES.find(l => l.code === language)?.label}
                  </span>
                )}
              </h4>
              <p className="text-xs text-muted-foreground">
                {buttons.find(b => b.key === activeLength)?.description}
              </p>
            </div>
          </div>
          <div className="prose prose-sm prose-invert max-w-none">
            {translating ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Translating...</span>
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {displayContent}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

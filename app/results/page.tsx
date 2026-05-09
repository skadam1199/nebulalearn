"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YouTubePlayer } from "@/components/results/youtube-player"
import { TimestampedOutline } from "@/components/results/timestamped-outline"
import { OutlineTab } from "@/components/results/outline-tab"
import { SummariesTab } from "@/components/results/summaries-tab"
import { FlashcardsTab } from "@/components/results/flashcards-tab"
import { SearchTab } from "@/components/results/search-tab"
import { FileText, BookOpen, Layers, Search, ArrowLeft, AlertCircle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return ""
}

function formatOutlineForTab(outline: any[]) {
  return outline.map((item, i) => ({
    id: String(i + 1),
    title: item.title,
    timestamp: item.start_time,
    content: item.subtopics?.map((s: any) => s.title) || [],
  }))
}

function formatOutlineItems(outline: any[]) {
  const items: any[] = []
  outline.forEach((item, i) => {
    items.push({ id: String(i + 1), timestamp: item.start_time, title: item.title })
    item.subtopics?.forEach((sub: any, j: number) => {
      items.push({ id: `${i + 1}-${j + 1}`, timestamp: sub.start_time, title: sub.title })
    })
  })
  return items
}

function formatFlashcards(flashcards: any[]) {
  return flashcards.map((f, i) => ({
    id: String(i + 1),
    question: f.question,
    answer: f.answer,
    source_time: f.source_time,
  }))
}

// Loading state component
function LoadingState({ stage }: { stage: string }) {
  const stages = [
    { key: "extracting", label: "Agent 1 — Extracting transcript" },
    { key: "outline", label: "Agent 2 — Building outline" },
    { key: "summaries", label: "Agent 2 — Generating summaries" },
    { key: "flashcards", label: "Agent 2 — Creating flashcards" },
    { key: "embedding", label: "Agent 3 — Embedding for search" },
    { key: "done", label: "Done" },
  ]
  const current = stages.findIndex(s => s.key === stage)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Processing your lecture</h2>
          <p className="text-muted-foreground text-sm">6 AI agents are working on this — takes about 30 seconds</p>
        </motion.div>

        <div className="space-y-3">
          {stages.slice(0, -1).map((s, i) => {
            const isDone = i < current
            const isActive = i === current
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={[
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  isDone ? "border-cyan-500/40 bg-cyan-500/5" : isActive ? "border-cyan-500/60 bg-cyan-500/10" : "border-border/40 opacity-40"
                ].join(" ")}
              >
                <div className={[
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  isDone ? "bg-cyan-500" : isActive ? "border-2 border-cyan-500" : "border-2 border-border"
                ].join(" ")}>
                  {isDone && <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  {isActive && <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
                </div>
                <span className={["text-sm font-medium", isDone || isActive ? "text-foreground" : "text-muted-foreground"].join(" ")}>
                  {s.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ error, url }: { error: string; url: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Could not process video</h2>
        <p className="text-muted-foreground text-sm mb-6">{error}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-background font-medium hover:bg-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url") || ""
  const role = searchParams.get("role") || "student"

  const [currentTime, setCurrentTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState("extracting")
  const [error, setError] = useState("")
  const [videoId, setVideoId] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [outline, setOutline] = useState<any[]>([])
  const [outlineItems, setOutlineItems] = useState<any[]>([])
  const [summaries, setSummaries] = useState<any>({})
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [processedVideoId, setProcessedVideoId] = useState("")
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!url || hasFetched.current) return
    hasFetched.current = true

    const vid = extractVideoId(url)
    if (!vid) {
      setError("Invalid YouTube URL. Please go back and paste a valid YouTube link.")
      setLoading(false)
      return
    }
    setVideoId(vid)

    const process = async () => {
      try {
        setLoadingStage("extracting")
        const res = await fetch(`${API_URL}/api/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, language: "en" }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.detail || "Processing failed")
        }

        setLoadingStage("outline")
        const data = await res.json()

        setVideoTitle(data.title || "Lecture")
        setProcessedVideoId(data.video_id)

        setLoadingStage("summaries")
        const outlineSections = formatOutlineForTab(data.outline || [])
        const outlineItemsList = formatOutlineItems(data.outline || [])
        setOutline(outlineSections)
        setOutlineItems(outlineItemsList)

        setLoadingStage("flashcards")
        setSummaries({
          "90sec": data.summaries?.ninety_seconds || "",
          "5min": data.summaries?.five_minutes || "",
          full: data.summaries?.full || "",
        })

        setLoadingStage("embedding")
        setFlashcards(formatFlashcards(data.flashcards || []))

        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.")
        setLoading(false)
      }
    }

    process()
  }, [url])

  const handleSeek = useCallback((timestamp: number) => {
    setCurrentTime(timestamp)
    const iframe = document.getElementById("youtube-player") as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "seekTo", args: [timestamp, true] }),
        "*"
      )
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (!processedVideoId) return []
    try {
      const res = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, video_id: processedVideoId }),
      })
      if (!res.ok) return []
      const data = await res.json()
      return data.results || []
    } catch {
      return []
    }
  }, [processedVideoId])

  if (loading) return <LoadingState stage={loadingStage} />
  if (error) return <ErrorState error={error} url={url} />

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex-1 text-center px-4">
            <p className="text-sm font-medium text-foreground truncate max-w-lg mx-auto">{videoTitle}</p>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-background">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">NebulaLearn</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[40%] space-y-4"
          >
            <div className="sticky top-24">
              <YouTubePlayer videoId={videoId} onTimeUpdate={setCurrentTime} />
              <div className="mt-4 p-4 rounded-xl bg-card/30 border border-border backdrop-blur-sm">
                <TimestampedOutline items={outlineItems} currentTime={currentTime} onSeek={handleSeek} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-[60%]"
          >
            <Tabs defaultValue="outline" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-14 p-1 bg-secondary/50 rounded-xl backdrop-blur-sm mb-6">
                <TabsTrigger value="outline" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all">
                  <FileText className="w-4 h-4 mr-2" />Outline
                </TabsTrigger>
                <TabsTrigger value="summaries" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all">
                  <BookOpen className="w-4 h-4 mr-2" />Summaries
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all">
                  <Layers className="w-4 h-4 mr-2" />Flashcards
                </TabsTrigger>
                <TabsTrigger value="search" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all">
                  <Search className="w-4 h-4 mr-2" />Search
                </TabsTrigger>
              </TabsList>

              <div className="p-6 rounded-xl bg-card/30 border border-border backdrop-blur-sm min-h-[500px]">
                <TabsContent value="outline" className="mt-0">
                  <OutlineTab sections={outline} onSeek={handleSeek} />
                </TabsContent>
                <TabsContent value="summaries" className="mt-0">
                  <SummariesTab summaries={summaries} />
                </TabsContent>
                <TabsContent value="flashcards" className="mt-0">
                  <FlashcardsTab flashcards={flashcards} />
                </TabsContent>
                <TabsContent value="search" className="mt-0">
                  <SearchTab onSearch={handleSearch} onSeek={handleSeek} />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
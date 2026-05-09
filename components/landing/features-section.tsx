"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  ListTree,
  FileText,
  Layers,
  SearchCode,
  Languages,
  BarChart3,
  Zap,
} from "lucide-react"
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline"

const timelineData = [
  {
    id: 1,
    title: "AI Outline",
    date: "Agent 1",
    content:
      "Generates a structured chapter-by-chapter outline the moment a URL is submitted — so you always know what was covered and exactly where.",
    category: "Structure",
    icon: ListTree,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Smart Summaries",
    date: "Agent 2",
    content:
      "Condenses a 60-minute lecture into a crisp 90-second, 5-minute, or full-depth read — capturing every key idea without losing nuance.",
    category: "Comprehension",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "Flashcards",
    date: "Agent 3",
    content:
      "Auto-generates spaced-repetition flashcard decks from video content so students can review and retain concepts long after the lecture ends.",
    category: "Retention",
    icon: Layers,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 88,
  },
  {
    id: 4,
    title: "Semantic Search",
    date: "Agent 4",
    content:
      "Ask a question in plain English and jump directly to the exact timestamp in the video that answers it — no scrubbing required.",
    category: "Discovery",
    icon: SearchCode,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 80,
  },
  {
    id: 5,
    title: "Multilingual",
    date: "Agent 5",
    content:
      "Outlines, summaries, and flashcards are generated in the student's preferred language. Supports 10+ languages with no extra configuration.",
    category: "Accessibility",
    icon: Languages,
    relatedIds: [4, 6],
    status: "in-progress" as const,
    energy: 72,
  },
  {
    id: 6,
    title: "Faculty Insights",
    date: "Agent 6",
    content:
      "Professors and deans get engagement heatmaps showing which concepts students replayed, skipped, or struggled with — turning usage into curriculum intelligence.",
    category: "Analytics",
    icon: BarChart3,
    relatedIds: [5, 1],
    status: "pending" as const,
    energy: 65,
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-primary/4 blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-accent/4 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">6 AI Agents, one pipeline</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 text-balance">
            Every tool you need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              master any lecture
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Six specialized AI agents work in sequence the moment you paste a YouTube URL.
            Click any node to explore how they connect.
          </p>
        </motion.div>

        {/* Orbital timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <RadialOrbitalTimeline timelineData={timelineData} />
        </motion.div>

        {/* Helper hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-xs text-muted-foreground/60 mt-2 tracking-wide"
        >
          Click a node to expand &mdash; click the orbit to reset
        </motion.p>
      </div>
    </section>
  )
}

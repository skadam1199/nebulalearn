"use client"

import { motion } from "framer-motion"
import { Brain, FileText, Lightbulb, CreditCard, Search, Languages, BarChart3, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const outputNodes = [
  { icon: FileText,    label: "AI Outline" },
  { icon: Lightbulb,  label: "Summary" },
  { icon: CreditCard, label: "Flashcards" },
  { icon: Search,     label: "Search" },
  { icon: Languages,  label: "Multilingual" },
  { icon: BarChart3,  label: "Insights" },
]

function FlowingParticles({ count = 6, color = "#22D3EE", reverse = false }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: color,
            left: reverse ? "auto" : 0,
            right: reverse ? 0 : "auto",
          }}
          animate={{
            x: reverse ? [0, -120] : [0, 120],
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 0.8, 0.4],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.27,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  )
}

export function HeroAnimation() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="w-full py-8 px-4">
      {/* Pipeline row */}
      <div className="flex items-center justify-center gap-0 flex-wrap lg:flex-nowrap">

        {/* ── Node 1: Lecture Video ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-shrink-0"
        >
          <motion.div
            className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 w-32"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 24px rgba(239,68,68,0.35)" }}
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <Play className="w-6 h-6 text-red-400 ml-0.5" />
            </div>
            <p className="text-xs font-semibold text-foreground text-center leading-tight">Lecture Video</p>
          </motion.div>
        </motion.div>

        {/* ── Connector 1: Video → Brain ── */}
        <motion.div
          className="relative h-px w-20 lg:w-28 bg-gradient-to-r from-red-500/40 via-cyan-500/60 to-cyan-500/80 flex-shrink-0 mx-1"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ transformOrigin: "left" }}
        >
          <FlowingParticles count={6} color="#22D3EE" />
        </motion.div>

        {/* ── Node 2: Brain / AI Core ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.7, type: "spring", stiffness: 200 }}
          className="flex-shrink-0"
        >
          <motion.div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.05) 70%)",
              border: "1px solid rgba(34,211,238,0.45)",
            }}
            animate={{
              boxShadow: [
                "0 0 18px rgba(34,211,238,0.25)",
                "0 0 38px rgba(34,211,238,0.55)",
                "0 0 18px rgba(34,211,238,0.25)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Spinning dashed ring */}
            <motion.div
              className="absolute inset-2 rounded-full border border-dashed border-cyan-500/35"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            {/* Counter-spinning inner ring */}
            <motion.div
              className="absolute inset-4 rounded-full border border-dotted border-cyan-400/25"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <Brain className="w-10 h-10 text-cyan-400 relative z-10" />

            {/* Spark dots orbiting */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "0 0",
                }}
                animate={{
                  rotate: [deg, deg + 360],
                  x: [Math.cos((deg * Math.PI) / 180) * 36, Math.cos(((deg + 360) * Math.PI) / 180) * 36],
                  y: [Math.sin((deg * Math.PI) / 180) * 36, Math.sin(((deg + 360) * Math.PI) / 180) * 36],
                  scale: [0.6, 1.2, 0.6],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ── Connector 2: Brain → Outputs ── */}
        <motion.div
          className="relative h-px w-20 lg:w-28 bg-gradient-to-r from-cyan-500/80 to-cyan-400/40 flex-shrink-0 mx-1"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          style={{ transformOrigin: "left" }}
        >
          <FlowingParticles count={7} color="#22D3EE" />
        </motion.div>

        {/* ── Node 3: 6 output cards (2×3 grid) ── */}
        <motion.div
          className="grid grid-cols-3 grid-rows-2 gap-2 flex-shrink-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          {outputNodes.map((node, i) => {
            const Icon = node.icon
            return (
              <motion.div
                key={node.label}
                className="glass-card p-2.5 rounded-xl flex flex-col items-center gap-1 cursor-pointer w-[72px]"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.4 + i * 0.08 }}
                whileHover={{
                  scale: 1.12,
                  boxShadow: "0 0 18px rgba(34,211,238,0.4)",
                }}
                animate={{
                  y: [0, -3, 0],
                  opacity: [null, 1],
                  scale: [null, 1],
                } as any}
                // @ts-ignore
                transition={{
                  y: { duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" },
                  opacity: { duration: 0.4, delay: 1.4 + i * 0.08 },
                  scale: { duration: 0.4, delay: 1.4 + i * 0.08 },
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] font-medium text-foreground text-center leading-tight">{node.label}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Bottom label */}
      <motion.p
        className="text-center text-xs text-muted-foreground mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        Your lecture, fully processed in under 60 seconds.
      </motion.p>
    </div>
  )
}

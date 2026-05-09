"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const stats = [
  {
    value: "60",
    arrow: "→",
    suffix: "15min",
    label: "Study time",
    description: "condensed automatically"
  },
  {
    value: "6",
    arrow: null,
    suffix: " AI Agents",
    label: "In the pipeline",
    description: "working in sequence"
  },
  {
    value: "10",
    arrow: null,
    suffix: "+ Languages",
    label: "Supported",
    description: "out of the box"
  },
  {
    value: "100%",
    arrow: null,
    suffix: " Private",
    label: "Your data",
    description: "never used to train models"
  },
]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-24 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-card via-card/80 to-card border border-border rounded-3xl p-12 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 leading-tight"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                  {stat.arrow && (
                    <span className="text-muted-foreground mx-1 text-2xl md:text-3xl">{stat.arrow}</span>
                  )}
                  {stat.suffix}
                </motion.div>
                <p className="text-base font-semibold text-foreground mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

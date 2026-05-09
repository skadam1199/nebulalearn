"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { GraduationCap, BookMarked, Building2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const roles = [
  {
    id: "student",
    icon: GraduationCap,
    title: "For Students",
    subtitle: "Study smarter, not longer",
    description: "Paste a YouTube lecture URL and get a full outline, summary, and flashcard deck in under a minute. Semantic search means you never scrub through video again.",
    features: [
      "Instant AI outline with timestamps",
      "15-minute smart summary of any lecture",
      "Auto-generated flashcard decks",
      "Ask questions in plain language"
    ],
    color: "from-primary to-accent",
    bgColor: "bg-primary/10"
  },
  {
    id: "professor",
    icon: BookMarked,
    title: "For Faculty",
    subtitle: "Enrich your curriculum",
    description: "Build curated video libraries for your course, see which concepts students struggled with via engagement heatmaps, and create assessments in minutes.",
    features: [
      "Curate video playlists per module",
      "Engagement heatmaps by concept",
      "One-click quiz generation",
      "LMS integration ready"
    ],
    color: "from-accent to-primary",
    bgColor: "bg-accent/10"
  },
  {
    id: "dean",
    icon: Building2,
    title: "For Provosts",
    subtitle: "Department-wide visibility",
    description: "Get a real-time view of how video resources are being used across every department, identify learning gaps early, and measure outcomes at scale.",
    features: [
      "Cross-department usage dashboard",
      "Learning gap identification",
      "ROI and outcome reports",
      "100% private — your data stays yours"
    ],
    color: "from-primary via-accent to-primary",
    bgColor: "bg-primary/10"
  }
]

export function RolesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeRole, setActiveRole] = useState("student")

  const activeRoleData = roles.find(r => r.id === activeRole)!

  return (
    <section className="py-10 px-4 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              every role
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Whether you&apos;re studying, teaching, or managing — NebulaLearn adapts to your workflow.
          </p>
        </motion.div>

        {/* Role tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {roles.map((role) => (
            <motion.button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                activeRole === role.id
                  ? "bg-card border-primary shadow-lg shadow-primary/20"
                  : "bg-card/50 border-border hover:bg-card hover:border-border"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <role.icon className={`w-5 h-5 ${activeRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-medium ${activeRole === role.id ? "text-foreground" : "text-muted-foreground"}`}>
                {role.title}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content area */}
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeRoleData.bgColor} mb-6`}>
                <activeRoleData.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{activeRoleData.subtitle}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {activeRoleData.title}
              </h3>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {activeRoleData.description}
              </p>

              <ul className="space-y-4 mb-8">
                {activeRoleData.features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                size="lg"
                className="px-8 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                Start as {activeRoleData.id === "dean" ? "a Dean" : activeRoleData.id === "professor" ? "a Professor" : "a Student"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${activeRoleData.color} rounded-3xl blur-3xl opacity-15`} />

              <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
                {/* Mock dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${activeRoleData.bgColor} flex items-center justify-center`}>
                        <activeRoleData.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{activeRoleData.title.replace("For ", "")} Dashboard</p>
                        <p className="text-xs text-muted-foreground">Updated just now</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                      Live
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-foreground">12</p>
                      <p className="text-xs text-muted-foreground">Lectures processed</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-primary">94%</p>
                      <p className="text-xs text-muted-foreground">Comprehension score</p>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-3 pt-2">
                    {[
                      { label: "AI Outline", pct: 100 },
                      { label: "Smart Summary", pct: 100 },
                      { label: "Flashcards", pct: 88 },
                    ].map(({ label, pct }, i) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-foreground">{pct}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

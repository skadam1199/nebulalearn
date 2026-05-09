'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, GraduationCap, BookOpen, BarChart3, Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    headline: 'Turn any lecture into your personal study kit.',
    sub: 'Get AI outlines, flashcards, summaries and semantic search — in minutes.',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    icon: BookOpen,
    headline: 'Make every lecture video work harder for your students.',
    sub: 'Auto-generate study materials, track engagement and support 10+ languages.',
  },
  {
    id: 'provost',
    label: 'Provost',
    icon: BarChart3,
    headline: 'Institution-wide insight into video learning outcomes.',
    sub: 'Aggregate analytics across departments, courses, and cohorts — all private.',
  },
]

export function DashboardHero({ userName }: { userName: string }) {
  const [activeRole, setActiveRole] = useState<string>('student')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const current = ROLES.find(r => r.id === activeRole)!

  const handleProcess = () => {
    if (!url.trim()) return
    setIsLoading(true)
    // Navigate to results with the URL as a query param
    router.push(`/results?url=${encodeURIComponent(url.trim())}`)
  }

  const isValidUrl = url.trim().length > 0

  return (
    <section className="relative w-full px-4 pt-12 pb-10 sm:px-6 lg:px-8">
      {/* Ambient glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden"
      >
        <div className="h-64 w-[600px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative mx-auto max-w-3xl">

        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center text-sm font-medium tracking-widest uppercase text-cyan-500"
        >
          Welcome back, {userName}
        </motion.p>

        {/* Role Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8 flex justify-center"
        >
          <div className="glass-card inline-flex items-center gap-1 rounded-full p-1">
            {ROLES.map(({ id, label, icon: Icon }) => {
              const isActive = activeRole === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveRole(id)}
                  className={[
                    'relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-cyan-500 text-background shadow-[0_0_16px_rgba(34,211,238,0.4)]'
                      : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Dynamic headline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mb-10 text-center"
          >
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {current.headline}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {current.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="glass-card flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:gap-2">
            {/* YouTube icon inside input row */}
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-background/40 px-4 py-1 ring-1 ring-border/50 focus-within:ring-cyan-500/60 transition-all">
              <Youtube className="h-5 w-5 shrink-0 text-red-500" />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleProcess()}
                placeholder="Paste your YouTube lecture URL..."
                className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>

            <Button
              onClick={handleProcess}
              disabled={!isValidUrl || isLoading}
              className="h-12 shrink-0 rounded-xl bg-cyan-500 px-6 font-semibold text-background hover:bg-cyan-400 disabled:opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)] transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Process Video
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

          {/* Helper hint */}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Works with any public YouTube URL &mdash; lectures, seminars, tutorials.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

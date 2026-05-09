"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { HeroAnimation } from "./hero-animation"
import { Spotlight } from "@/components/ui/spotlight"
import { SplineScene } from "@/components/ui/spline-scene"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#22D3EE" />

      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 animate-pulse-glow"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/15 animate-pulse-glow"
          style={{ animationDelay: "1s" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-24 pb-4">
        {/* Top row: text left, robot right */}
        <div className="flex flex-col lg:flex-row items-center gap-8">

          {/* Left: text + CTAs */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Powered by 6 specialized AI agents</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance mb-6"
            >
              <span className="text-foreground">Turn any lecture into</span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                a complete study
              </motion.span>
              <br />
              <span className="text-foreground">experience.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 text-pretty"
            >
              NebulaLearn processes any educational YouTube video and instantly generates outlines,
              smart summaries, flashcards, and semantic search — in 10+ languages, fully private.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
            >
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group"
                asChild
              >
                <Link href="/auth/sign-up">
                  Start Learning
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-border hover:bg-secondary group"
                asChild
              >
                <a href="#features">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  See how it works
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right: Spline robot — no overlays */}
          <motion.div
            className="flex-1 w-full h-[520px] relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </motion.div>
        </div>

        {/* Bottom row: full-width pipeline animation */}
        <motion.div
          className="w-full mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <div className="glass-card rounded-2xl border border-primary/15 px-6 py-4">
            <HeroAnimation />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Play, FileText, Brain, Search, Clock, Sparkles } from 'lucide-react'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import type { User } from '@supabase/supabase-js'

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const userName = user.email?.split('@')[0] ?? 'there'

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">

      {/* Hero: role tabs + URL input */}
      <DashboardHero userName={userName} />

      {/* Divider */}
      <div className="mb-8 h-px w-full bg-border/50" />

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Videos Processed', value: '0' },
          { label: 'Flashcards Created', value: '0' },
          { label: 'Study Time Saved',  value: '0h' },
          { label: 'Languages Used',    value: '0' },
        ].map(({ label, value }) => (
          <Card key={label} className="glass-card rounded-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-muted-foreground">{label}</CardDescription>
              <CardTitle className="text-3xl text-cyan-500">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Play,
            title: 'Process New Video',
            desc: 'Paste a YouTube URL and let our AI agents analyze it',
          },
          {
            icon: FileText,
            title: 'View Summaries',
            desc: 'Access AI-generated outlines and smart summaries',
          },
          {
            icon: Brain,
            title: 'Study Flashcards',
            desc: 'Review auto-generated flashcards from your videos',
          },
          {
            icon: Search,
            title: 'Semantic Search',
            desc: 'Find exactly what you need across all your content',
          },
          {
            icon: Clock,
            title: 'Recent Activity',
            desc: 'Continue where you left off with your studies',
          },
          {
            icon: Sparkles,
            title: 'AI Insights',
            desc: 'Get personalised learning recommendations',
          },
        ].map(({ icon: Icon, title, desc }) => (
          <Card
            key={title}
            className="glass-card group cursor-pointer rounded-xl transition-all duration-200 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
          >
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 transition-colors group-hover:bg-cyan-500 group-hover:text-background">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-foreground">{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  )
}

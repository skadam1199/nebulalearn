// components/dashboard/dashboard-content.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Play, Clock, Layers, Globe, Loader2, Trash2, ExternalLink } from 'lucide-react'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import { useVideoHistory } from '@/lib/hooks/useVideoHistory'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface DashboardContentProps {
  user: User
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function DashboardContent({ user }: DashboardContentProps) {
  const userName = user.email?.split('@')[0] ?? 'there'
  const { videos, stats, loading, refetch } = useVideoHistory()
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    setDeleting(id)
    await supabase.from('processed_videos').delete().eq('id', id)
    await refetch()
    setDeleting(null)
  }

  const statCards = [
    { label: 'Videos Processed', value: loading ? '…' : String(stats.videosProcessed), icon: Play },
    { label: 'Flashcards Created', value: loading ? '…' : String(stats.flashcardsCreated), icon: Layers },
    { label: 'Study Time Saved', value: loading ? '…' : stats.studyTimeSaved, icon: Clock },
    { label: 'Languages Used', value: loading ? '…' : String(stats.languagesUsed), icon: Globe },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">

      {/* Hero: role tabs + URL input */}
      <DashboardHero userName={userName} />

      {/* Divider */}
      <div className="mb-8 h-px w-full bg-border/50" />

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="glass-card rounded-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <CardDescription className="text-muted-foreground">{label}</CardDescription>
                <Icon className="w-4 h-4 text-cyan-500/60" />
              </div>
              <CardTitle className="text-3xl text-cyan-500">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-cyan-500/50" /> : value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Recent Videos */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Videos</h2>
        {videos.length > 0 && (
          <span className="text-sm text-muted-foreground">{videos.length} processed</span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
            <Play className="w-7 h-7 text-cyan-500/50" />
          </div>
          <p className="text-muted-foreground text-sm">No videos processed yet.</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Paste a YouTube URL above to get started.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="glass-card rounded-xl group relative overflow-hidden hover:border-cyan-500/40 transition-all duration-200"
            >
              <CardHeader className="pb-3">
                {/* Role badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={[
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    video.role === 'faculty'
                      ? 'bg-purple-500/10 text-purple-400'
                      : video.role === 'provost'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-cyan-500/10 text-cyan-400'
                  ].join(' ')}>
                    {video.role}
                  </span>
                  <span className="text-xs text-muted-foreground">{timeAgo(video.created_at)}</span>
                </div>

                {/* Title */}
                <CardTitle className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                  {video.title}
                </CardTitle>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(video.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {video.flashcard_count} cards
                  </span>
                  {video.language !== 'en' && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {video.language.toUpperCase()}
                    </span>
                  )}
                </div>
              </CardHeader>

              {/* Actions */}
              <div className="px-6 pb-4 flex items-center gap-2">
                <Link
                  href={`/results?url=${encodeURIComponent(video.url)}&role=${video.role}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open
                </Link>
                <button
                  onClick={() => handleDelete(video.id)}
                  disabled={deleting === video.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  {deleting === video.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />
                  }
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

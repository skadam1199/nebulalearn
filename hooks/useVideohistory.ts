// lib/hooks/useVideoHistory.ts
// Drop this in: /lib/hooks/useVideoHistory.ts

'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface VideoRecord {
  id: string
  video_id: string
  title: string
  duration: number
  url: string
  role: string
  outline: any[]
  summaries: Record<string, string>
  flashcards: any[]
  flashcard_count: number
  language: string
  created_at: string
}

export interface UserStats {
  videosProcessed: number
  flashcardsCreated: number
  studyTimeSaved: string
  languagesUsed: number
}

export function useVideoHistory() {
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [stats, setStats] = useState<UserStats>({
    videosProcessed: 0,
    flashcardsCreated: 0,
    studyTimeSaved: '0h',
    languagesUsed: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('processed_videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      setVideos(data)

      // Compute stats
      const totalFlashcards = data.reduce((sum, v) => sum + (v.flashcard_count || 0), 0)
      const totalDuration = data.reduce((sum, v) => sum + (v.duration || 0), 0)
      const savedSeconds = Math.floor(totalDuration * 0.8) // assume 80% time saved vs watching
      const savedHours = savedSeconds / 3600
      const languages = new Set(data.map(v => v.language).filter(l => l && l !== 'en'))

      setStats({
        videosProcessed: data.length,
        flashcardsCreated: totalFlashcards,
        studyTimeSaved: savedHours >= 1
          ? `${savedHours.toFixed(1)}h`
          : `${Math.floor(savedSeconds / 60)}m`,
        languagesUsed: languages.size,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { videos, stats, loading, refetch: fetchHistory }
}

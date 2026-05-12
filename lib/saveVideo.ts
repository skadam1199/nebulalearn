// lib/saveVideo.ts
// Call this after /api/process returns successfully
// Drop in: /lib/saveVideo.ts

import { createClient } from '@/lib/supabase/client'

interface SaveVideoParams {
  video_id: string
  title: string
  duration: number
  url: string
  role: string
  outline: any[]
  summaries: Record<string, string>
  flashcards: any[]
  language: string
}

export async function saveVideo(params: SaveVideoParams): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // upsert: if same user+video_id exists, update it
  const { error } = await supabase
    .from('processed_videos')
    .upsert(
      {
        user_id: user.id,
        video_id: params.video_id,
        title: params.title,
        duration: params.duration,
        url: params.url,
        role: params.role,
        outline: params.outline,
        summaries: params.summaries,
        flashcards: params.flashcards,
        language: params.language,
      },
      { onConflict: 'user_id,video_id' }
    )

  if (error) {
    console.error('Failed to save video to history:', error.message)
  }
}

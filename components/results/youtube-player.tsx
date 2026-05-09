"use client"

import { useState, useRef, useEffect } from "react"

interface YouTubePlayerProps {
  videoId: string
  onTimeUpdate?: (time: number) => void
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string
          events: {
            onReady: (event: { target: YTPlayer }) => void
            onStateChange?: (event: { data: number }) => void
          }
          playerVars?: {
            autoplay?: number
            modestbranding?: number
            rel?: number
          }
        }
      ) => YTPlayer
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YTPlayer {
  getCurrentTime: () => number
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  pauseVideo: () => void
  destroy: () => void
}

export function YouTubePlayer({ videoId, onTimeUpdate }: YouTubePlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = initPlayer
    } else {
      initPlayer()
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        events: {
          onReady: () => setIsReady(true),
        },
        playerVars: {
          modestbranding: 1,
          rel: 0,
        },
      })
    }

    return () => {
      playerRef.current?.destroy()
    }
  }, [videoId])

  // Poll for time updates
  useEffect(() => {
    if (!isReady || !onTimeUpdate) return

    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime()
        onTimeUpdate(time)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isReady, onTimeUpdate])

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
      <div id="youtube-player" className="absolute inset-0 w-full h-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export function seekToTime(seconds: number) {
  const player = (window as Window & { YT?: { Player?: unknown } }).YT
  // This is a simplified approach - in production you'd use a ref or context
  const iframe = document.getElementById("youtube-player") as HTMLIFrameElement
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "seekTo",
        args: [seconds, true],
      }),
      "*"
    )
  }
}

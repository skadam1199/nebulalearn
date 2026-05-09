'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render icon after mount
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative h-9 w-9 rounded-full border border-border/50 bg-background/50 text-muted-foreground hover:border-cyan-500/50 hover:text-cyan-500 transition-colors"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4 transition-all duration-300" />
        ) : (
          <Moon className="h-4 w-4 transition-all duration-300" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </Button>
  )
}

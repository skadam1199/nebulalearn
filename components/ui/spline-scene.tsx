'use client'

import { Suspense, lazy, useState, useEffect, type ComponentType } from 'react'
import type { SplineProps } from '@splinetool/react-spline'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback: React.ReactNode 
}) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Data read') || event.message?.includes('buffer')) {
        setHasError(true)
        event.preventDefault()
      }
    }
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

function FallbackAnimation() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Animated robot silhouette fallback */}
      <div className="relative w-64 h-64">
        {/* Glowing orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 animate-pulse" />
        </div>
        {/* Orbiting rings */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
        </div>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-card/80 backdrop-blur border border-primary/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [mounted, setMounted] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <FallbackAnimation />
  }

  if (loadError) {
    return <FallbackAnimation />
  }

  return (
    <SplineErrorBoundary fallback={<FallbackAnimation />}>
      <Suspense fallback={<FallbackAnimation />}>
        <Spline
          scene={scene}
          className={className}
          onError={() => setLoadError(true)}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}

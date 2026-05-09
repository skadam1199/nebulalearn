"use client"

import { useCallback, useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { ISourceOptions } from "@tsparticles/engine"

const particleOptions: ISourceOptions = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "attract",
      },
    },
    modes: {
      attract: {
        distance: 180,
        duration: 0.4,
        speed: 1.5,
      },
    },
  },
  particles: {
    color: { value: "#22D3EE" },
    links: {
      color: "#22D3EE",
      distance: 130,
      enable: true,
      opacity: 0.18,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" },
    },
    number: {
      value: 80,
      density: { enable: true, width: 1200, height: 800 },
    },
    opacity: {
      value: { min: 0.2, max: 0.55 },
      animation: {
        enable: true,
        speed: 0.5,
        sync: false,
      },
    },
    shape: { type: "circle" },
    size: {
      value: { min: 1, max: 2.5 },
    },
  },
  detectRetina: true,
}

export function ParticlesBackground() {
  const [engineReady, setEngineReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setEngineReady(true))
  }, [])

  const particlesLoaded = useCallback(async () => {}, [])

  if (!engineReady) return null

  return (
    <Particles
      id="dashboard-particles"
      particlesLoaded={particlesLoaded}
      options={particleOptions}
      className="absolute inset-0 h-full w-full"
    />
  )
}

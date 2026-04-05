'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  pulseSpeed: number
  pulseOffset: number
}

interface ThemeConfig {
  color: string
  glowColor: string
  particleCount: number
  connectionDistance: number
  speed: number
}

const themes: Record<string, ThemeConfig> = {
  default: {
    color: 'rgba(123, 46, 255, 0.6)',
    glowColor: 'rgba(123, 46, 255, 0.15)',
    particleCount: 60,
    connectionDistance: 150,
    speed: 0.5,
  },
  sports: {
    color: 'rgba(34, 197, 94, 0.6)',
    glowColor: 'rgba(34, 197, 94, 0.15)',
    particleCount: 70,
    connectionDistance: 140,
    speed: 0.7,
  },
  cinema: {
    color: 'rgba(245, 158, 11, 0.6)',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    particleCount: 50,
    connectionDistance: 160,
    speed: 0.4,
  },
  celebration: {
    color: 'rgba(236, 72, 153, 0.6)',
    glowColor: 'rgba(236, 72, 153, 0.15)',
    particleCount: 80,
    connectionDistance: 130,
    speed: 0.6,
  },
  ocean: {
    color: 'rgba(14, 165, 233, 0.6)',
    glowColor: 'rgba(14, 165, 233, 0.15)',
    particleCount: 55,
    connectionDistance: 155,
    speed: 0.35,
  },
}

interface ParticleBackgroundProps {
  theme?: string
  enabled?: boolean
  interactive?: boolean
}

export function ParticleBackground({ 
  theme = 'default', 
  enabled = true,
  interactive = false 
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const particlesRef = useRef<Particle[]>([])
  const rafTimeRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const [currentTheme, setCurrentTheme] = useState(theme)

  useEffect(() => {
    setCurrentTheme(theme)
  }, [theme])

  const config = themes[currentTheme] || themes.default

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interactive) return
    mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
  }, [interactive])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0
    const targetFps = 30
    const frameInterval = 1000 / targetFps

    // Set canvas size with device pixel ratio for crisp rendering
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setCanvasSize()

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      const isMobile = window.innerWidth < 768
      const targetCount = reducedMotionRef.current
        ? Math.max(16, Math.floor(config.particleCount * 0.35))
        : isMobile
          ? Math.max(20, Math.floor(config.particleCount * 0.5))
          : config.particleCount

      for (let i = 0; i < targetCount; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    initParticles()

    const animate = (timestamp: number) => {
      animationId = requestAnimationFrame(animate)

      if (document.hidden) {
        return
      }

      if (timestamp - rafTimeRef.current < frameInterval) {
        return
      }
      rafTimeRef.current = timestamp

      time += 0.016
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const particles = particlesRef.current

      // Draw glow layer
      if (!reducedMotionRef.current) {
        particles.forEach((particle) => {
          const pulse = Math.sin(time * particle.pulseSpeed * 60 + particle.pulseOffset) * 0.3 + 0.7
          const glowRadius = particle.radius * 4 * pulse

          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowRadius
          )
          gradient.addColorStop(0, config.glowColor)
          gradient.addColorStop(1, 'transparent')

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        })
      }

      // Draw connections
      ctx.lineWidth = 1
      const connectionDistance = reducedMotionRef.current
        ? config.connectionDistance * 0.6
        : config.connectionDistance

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.22
            ctx.strokeStyle = config.color.replace(/[\d.]+\)$/, `${opacity})`)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and update particles
      particles.forEach((particle) => {
        // Mouse interaction
        if (mouseRef.current.active && interactive && !reducedMotionRef.current) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 200) {
            const force = (200 - distance) / 200 * 0.02
            particle.vx += dx * force
            particle.vy += dy * force
          }
        }

        // Apply velocity limits
        const maxSpeed = config.speed * 2
        const currentSpeed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
        if (currentSpeed > maxSpeed) {
          particle.vx = (particle.vx / currentSpeed) * maxSpeed
          particle.vy = (particle.vy / currentSpeed) * maxSpeed
        }

        // Apply friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Add base velocity
        if (Math.abs(particle.vx) < config.speed * 0.1) {
          particle.vx += (Math.random() - 0.5) * config.speed * 0.1
        }
        if (Math.abs(particle.vy) < config.speed * 0.1) {
          particle.vy += (Math.random() - 0.5) * config.speed * 0.1
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < -10) particle.x = window.innerWidth + 10
        if (particle.x > window.innerWidth + 10) particle.x = -10
        if (particle.y < -10) particle.y = window.innerHeight + 10
        if (particle.y > window.innerHeight + 10) particle.y = -10

        // Draw particle
        const pulse = Math.sin(time * particle.pulseSpeed * 60 + particle.pulseOffset) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * pulse, 0, Math.PI * 2)
        ctx.fillStyle = config.color
        ctx.fill()
      })

    }

    animationId = requestAnimationFrame(animate)

    // Event listeners
    window.addEventListener('resize', setCanvasSize)
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled, currentTheme, config, handleMouseMove, handleMouseLeave, interactive])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

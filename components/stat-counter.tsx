'use client'

import { useEffect, useState } from 'react'

interface StatCounterProps {
  target: number
  label: string
  duration?: number
}

export function StatCounter({ target, label, duration = 2000 }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`counter-${label}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [label])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const increment = target / (duration / 16)
    let animationId: number

    const animate = () => {
      start += increment
      if (start < target) {
        setCount(Math.floor(start))
        animationId = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isVisible, target, duration])

  return (
    <div
      id={`counter-${label}`}
      className="flex flex-col items-center justify-center gap-2"
    >
      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm md:text-base text-gray-300">{label}</div>
    </div>
  )
}

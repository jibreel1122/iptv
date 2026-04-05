'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, Film, PartyPopper, Waves, X, Palette } from 'lucide-react'
import type { Theme } from '@/lib/db'

interface ThemeSwitcherProps {
  themes: Theme[]
  currentTheme: string
  onThemeChange: (theme: string) => void
  onToggle: (enabled: boolean) => void
  enabled: boolean
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Trophy,
  Film,
  PartyPopper,
  Waves,
}

export function ThemeSwitcher({ 
  themes, 
  currentTheme, 
  onThemeChange,
  onToggle,
  enabled 
}: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[#0B0033]/90 border border-[#7B2EFF]/30 backdrop-blur-sm hover:border-[#7B2EFF]/60 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Palette className="w-5 h-5 text-[#7B2EFF]" />
        <span className="text-sm font-medium text-white">Theme</span>
      </motion.button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0B0033]/95 border-l border-[#7B2EFF]/20 backdrop-blur-xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Particle Theme</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white font-medium">Particles</span>
                <button
                  onClick={() => onToggle(!enabled)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    enabled ? 'bg-[#7B2EFF]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                    animate={{ left: enabled ? '32px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Theme Grid */}
              <div className="space-y-3">
                {themes.map((theme) => {
                  const Icon = iconMap[theme.icon || 'Sparkles'] || Sparkles
                  const isActive = currentTheme === theme.slug
                  
                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => {
                        onThemeChange(theme.slug)
                        if (!enabled) onToggle(true)
                      }}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        isActive
                          ? 'border-[#7B2EFF] bg-[#7B2EFF]/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${theme.particle_color}20`,
                            boxShadow: isActive ? `0 0 20px ${theme.glow_color}` : 'none'
                          }}
                        >
                          <Icon 
                            className="w-5 h-5" 
                            style={{ color: theme.particle_color || '#7B2EFF' }}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{theme.name}</h4>
                          <p className="text-sm text-white/60">{theme.description}</p>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-3 h-3 rounded-full bg-[#7B2EFF]"
                          />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Color Preview */}
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/60 mb-3">Active Color</p>
                <div className="flex gap-2">
                  {themes.map((t) => (
                    <motion.div
                      key={t.id}
                      className={`w-8 h-8 rounded-full cursor-pointer ${
                        currentTheme === t.slug ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0B0033]' : ''
                      }`}
                      style={{ backgroundColor: t.particle_color || '#7B2EFF' }}
                      onClick={() => {
                        onThemeChange(t.slug)
                        if (!enabled) onToggle(true)
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

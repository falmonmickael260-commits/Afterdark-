import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ParticleField } from './ParticleField'

const MESSAGES = [
  'Préparation de la soirée…',
  'Mélange des cartes…',
  'Allumage des bougies…',
  'Réglage de l\'ambiance…',
]

export function AppLoader() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length)
    }, 850)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-afterdark flex items-center justify-center overflow-hidden">
      <ParticleField count={36} />

      {/* halo pulsant derrière le logo */}
      <motion.div
        className="absolute h-64 w-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,46,99,0.35), transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* anneau orbital */}
        <div className="relative h-32 w-32 sm:h-40 sm:w-40 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: 'transparent', borderTopColor: '#ff2e63', borderRightColor: '#9b5de5' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border-2"
            style={{ borderColor: 'transparent', borderBottomColor: '#ff6bd6', borderLeftColor: '#ff2e63' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="font-display text-3xl sm:text-4xl text-gradient font-semibold"
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.96, 1.02, 0.96] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              AD
            </motion.span>
          </div>

          {/* particules orbitales */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                background: ['#ff2e63', '#9b5de5', '#ff6bd6'][i],
                boxShadow: `0 0 10px ${['#ff2e63', '#9b5de5', '#ff6bd6'][i]}`,
                top: '50%',
                left: '50%',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'linear' }}
            >
              <span
                className="absolute rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: 'inherit',
                  transform: `translate(${64 + i * 10}px, 0)`,
                }}
              />
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl sm:text-3xl uppercase text-gradient mb-3"
        >
          After Dark
        </motion.div>

        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[var(--text-dim)]"
        >
          {MESSAGES[messageIndex]}
        </motion.p>

        <div className="mt-6 h-1 w-40 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff2e63] via-[#ff6bd6] to-[#9b5de5]"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '60%' }}
          />
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'

export function Logo({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const isLg = size === 'lg'
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, letterSpacing: '0.1em' }}
      animate={{ opacity: 1, y: 0, letterSpacing: '0.35em' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div
        className={`font-display font-semibold uppercase ${isLg ? 'text-4xl sm:text-6xl' : 'text-xl'} text-gradient drop-shadow-[0_0_25px_rgba(255,46,99,0.45)]`}
      >
        After Dark
      </div>
      {isLg && (
        <div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--text-dim)]">
          Action ou Vérité — édition couple
        </div>
      )}
    </motion.div>
  )
}

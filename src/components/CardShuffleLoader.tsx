import { motion } from 'framer-motion'

const OFFSETS = [
  { rotate: -14, x: -26, delay: 0 },
  { rotate: 0, x: 0, delay: 0.08 },
  { rotate: 14, x: 26, delay: 0.16 },
]

export function CardShuffleLoader() {
  return (
    <div className="w-full aspect-[3/4] max-w-sm mx-auto flex items-center justify-center">
      <div className="relative h-full w-full flex items-center justify-center">
        {OFFSETS.map((o, i) => (
          <motion.div
            key={i}
            className="absolute h-[78%] w-[62%] rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0b26] via-[#0d0712] to-[#1a0b26] flex items-center justify-center overflow-hidden"
            style={{ boxShadow: '0 10px 40px rgba(155,93,229,0.25)' }}
            initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
            animate={{
              rotate: [0, o.rotate, 0, -o.rotate, 0],
              x: [0, o.x, 0, -o.x, 0],
              y: [0, -10, 0, -10, 0],
              opacity: 1,
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: o.delay,
            }}
          >
            <span className="font-display text-xl text-gradient opacity-80">AD</span>
          </motion.div>
        ))}

        <motion.div
          className="absolute -z-10 h-40 w-40 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,46,99,0.3), transparent 70%)' }}
          animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.p
          className="absolute bottom-0 text-xs uppercase tracking-[0.25em] text-[var(--text-dim)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          On mélange…
        </motion.p>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[#ff2e63] to-[#9b5de5] text-white shadow-[0_8px_30px_rgba(255,46,99,0.35)]',
  secondary:
    'bg-white/5 text-[var(--text)] border border-white/15 hover:bg-white/10',
  ghost: 'bg-transparent text-[var(--text-dim)] hover:text-white underline-offset-4 hover:underline',
  danger: 'bg-red-900/40 text-red-200 border border-red-500/40 hover:bg-red-900/60',
}

export function Button({ variant = 'primary', children, fullWidth, className = '', ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={`relative select-none rounded-2xl px-6 py-4 text-base font-semibold tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

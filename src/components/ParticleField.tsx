import { useMemo } from 'react'

interface Props {
  count?: number
  className?: string
}

const COLORS = ['#ff2e63', '#9b5de5', '#ff6bd6']

export function ParticleField({ count = 24, className = '' }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 6,
        color: COLORS[i % COLORS.length],
        opacity: 0.25 + Math.random() * 0.45,
      })),
    [count],
  )

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            top: `${p.top}%`,
            left: `${p.left}%`,
            background: p.color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

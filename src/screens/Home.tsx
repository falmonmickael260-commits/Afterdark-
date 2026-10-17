import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { ParticleField } from '../components/ParticleField'
import { Button } from '../components/Button'
import { LIBRARY_STATS } from '../data/cards'

interface Props {
  onStart: () => void
  onPlayOnline: () => void
  onCustomize: () => void
  onRules: () => void
  onResetMajority: () => void
}

export function Home({ onStart, onPlayOnline, onCustomize, onRules, onResetMajority }: Props) {
  return (
    <div className="relative min-h-screen bg-afterdark flex flex-col items-center justify-center p-6">
      <ParticleField count={32} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
      >
        <Logo />

        <p className="mt-6 font-display text-xl sm:text-2xl text-white/90 italic">
          « Jusqu'où oserez-vous aller ? »
        </p>

        <div className="mt-10 w-full flex flex-col gap-3">
          <Button onClick={onStart} fullWidth>
            Jouer en local (même téléphone)
          </Button>
          <Button onClick={onPlayOnline} fullWidth variant="secondary" className="!border-[#ff6bd6]/40">
            🌐 Jouer en ligne (à distance)
          </Button>
          <Button variant="secondary" onClick={onCustomize} fullWidth>
            Personnaliser mon jeu
          </Button>
          <Button variant="ghost" onClick={onRules} fullWidth>
            Règles &amp; préférences
          </Button>
        </div>

        <p className="mt-10 text-xs text-[var(--text-dim)]">
          {LIBRARY_STATS.mainTotal} cartes dans la bibliothèque, réparties sur 5
          niveaux d'intensité.
        </p>

        <button
          onClick={onResetMajority}
          className="mt-4 text-[11px] text-[var(--text-dim)]/60 underline underline-offset-2"
        >
          Réinitialiser la confirmation de majorité
        </button>
      </motion.div>
    </div>
  )
}

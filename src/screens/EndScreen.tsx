import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { ParticleField } from '../components/ParticleField'
import { Button } from '../components/Button'
import type { Player, TurnRecord } from '../types/game'

interface Props {
  players: [Player, Player]
  history: TurnRecord[]
  onReplay: () => void
  onHome: () => void
}

export function EndScreen({ players, history, onReplay, onHome }: Props) {
  const played = history.filter((h) => h.outcome === 'done').length
  const jokers = history.filter((h) => h.outcome === 'joker').length

  return (
    <div className="relative min-h-screen bg-afterdark flex items-center justify-center p-6">
      <ParticleField count={30} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel relative z-10 w-full max-w-md rounded-3xl p-8 text-center"
      >
        <Logo size="sm" />
        <h2 className="font-display text-2xl text-white mt-6 mb-2">Partie terminée</h2>
        <p className="text-sm text-[var(--text-dim)] mb-6">
          {players[0].name || 'Joueur 1'} &amp; {players[1].name || 'Joueur 2'}
        </p>

        <div className="flex justify-center gap-8 mb-8">
          <div>
            <div className="font-display text-3xl text-gradient">{history.length}</div>
            <div className="text-xs text-[var(--text-dim)]">cartes jouées</div>
          </div>
          <div>
            <div className="font-display text-3xl text-gradient">{played}</div>
            <div className="text-xs text-[var(--text-dim)]">réalisées</div>
          </div>
          <div>
            <div className="font-display text-3xl text-gradient">{jokers}</div>
            <div className="text-xs text-[var(--text-dim)]">jokers utilisés</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button fullWidth onClick={onReplay}>
            Rejouer
          </Button>
          <Button fullWidth variant="secondary" onClick={onHome}>
            Retour à l'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

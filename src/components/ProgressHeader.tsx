import type { Player } from '../types/game'
import { TURNS_PER_JOKER } from '../types/game'
import { CATEGORIES } from '../data/categories'

interface Props {
  players: [Player, Player]
  activePlayerIndex: 0 | 1
  turnNumber: number
  cardsPlayed: number
  maxIntensity: 1 | 2 | 3 | 4 | 5
  availableJokers: [number, number]
  onQuit: () => void
}

export function ProgressHeader({
  players,
  activePlayerIndex,
  turnNumber,
  cardsPlayed,
  maxIntensity,
  availableJokers,
  onQuit,
}: Props) {
  const intensityCat = CATEGORIES.find((c) => c.intensity === maxIntensity)
  const activePlayer = players[activePlayerIndex]

  return (
    <div className="w-full max-w-sm mx-auto mb-4">
      <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mb-2">
        <span>Tour {turnNumber}</span>
        <button onClick={onQuit} className="hover:text-white">
          Arrêter la partie
        </button>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-display text-lg text-white">
          Au tour de <span className="text-gradient">{activePlayer.name || 'Joueur'}</span>
        </div>
        <div className="text-xs text-[var(--text-dim)]">{cardsPlayed} cartes jouées</div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-[var(--text-dim)] mb-2">
        <span>
          Intensité max : {intensityCat?.emoji} {intensityCat?.label}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`flex-1 flex items-center justify-between rounded-xl px-3 py-1.5 border text-[11px] ${
              i === activePlayerIndex ? 'border-[#ff2e63]/50 bg-[#ff2e63]/10' : 'border-white/10 bg-white/5'
            }`}
          >
            <span className="text-[var(--text-dim)] truncate">{p.name || `Joueur ${i + 1}`}</span>
            <span className="text-white font-medium shrink-0 ml-2">
              🃏 {availableJokers[i]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1 text-center text-[10px] text-[var(--text-dim)]/70">
        Un joker toutes les {TURNS_PER_JOKER} tours joués, par joueur.
      </div>
    </div>
  )
}

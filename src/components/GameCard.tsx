import { motion } from 'framer-motion'
import type { Card } from '../types/game'
import { CATEGORY_MAP } from '../data/categories'

interface Props {
  card: Card | null
  revealed: boolean
  animationsEnabled: boolean
  hidden?: boolean
}

const SPECIAL_LABELS: Record<string, string> = {
  mystere: 'Carte Mystère',
  double: 'Double Choix',
  chrono: 'Défi Chronométré',
  inversee: 'Carte Inversée',
  joker: 'Carte Joker',
  surprise: 'Carte Surprise',
}

export function GameCard({ card, revealed, animationsEnabled, hidden }: Props) {
  const category = card ? CATEGORY_MAP[card.category] : null

  return (
    <div className="card-3d w-full aspect-[3/4] max-w-sm mx-auto">
      <div className={`card-3d-inner ${revealed ? 'flipped' : ''}`} style={!animationsEnabled ? { transition: 'none' } : undefined}>
        {/* Face arrière (dos de carte) */}
        <div className="card-face flex items-center justify-center bg-gradient-to-br from-[#1a0b26] via-[#0d0712] to-[#1a0b26] border border-white/10">
          <div className="text-center">
            <div className="font-display text-3xl text-gradient mb-2">AD</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-dim)]">
              After Dark
            </div>
          </div>
        </div>

        {/* Face avant (contenu) */}
        <div
          className="card-face card-face-back flex flex-col items-center justify-center p-6 text-center border"
          style={{
            background: category
              ? `linear-gradient(160deg, ${category.color}22, #0d0712 70%)`
              : '#0d0712',
            borderColor: category ? category.glow : 'rgba(255,255,255,0.1)',
          }}
        >
          {hidden ? (
            <div>
              <div className="text-4xl mb-4">🤫</div>
              <p className="text-[var(--text-dim)] text-sm">
                Lis ta carte discrètement, sans la montrer.
              </p>
            </div>
          ) : card && category ? (
            <>
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
                <span>{category.emoji}</span>
                <span style={{ color: category.color }}>{category.label}</span>
              </div>
              <div className="absolute top-4 right-4 text-xs rounded-full bg-white/10 px-2 py-0.5 uppercase">
                {card.type === 'verite' ? 'Vérité' : 'Action'}
              </div>
              {card.special && (
                <div className="absolute bottom-4 left-4 right-4 text-[10px] uppercase tracking-wide text-[var(--pink)]">
                  {SPECIAL_LABELS[card.special]}
                </div>
              )}
              <motion.p
                initial={animationsEnabled ? { opacity: 0, y: 10 } : undefined}
                animate={animationsEnabled ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="font-display text-xl sm:text-2xl leading-snug text-white mt-6"
              >
                {card.text}
              </motion.p>
              {card.duration && (
                <div className="mt-4 text-xs text-[var(--text-dim)]">⏱ {card.duration} secondes</div>
              )}
              {card.requiresConsent && (
                <div className="mt-2 text-[11px] text-[var(--pink)]">
                  Nécessite l'accord des deux joueurs
                </div>
              )}
            </>
          ) : (
            <div className="text-[var(--text-dim)]">Pioche une carte pour commencer…</div>
          )}
        </div>
      </div>
    </div>
  )
}

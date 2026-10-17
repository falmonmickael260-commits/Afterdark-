import { motion } from 'framer-motion'
import type { CategoryId, GameSettings } from '../types/game'
import { CATEGORIES } from '../data/categories'
import { ParticleField } from '../components/ParticleField'
import { Button } from '../components/Button'
import { cardCountByCategory } from '../data/cards'

interface Props {
  settings: GameSettings
  onPickMode: (patch: Partial<GameSettings>) => void
  onBack: () => void
  onAdjust: () => void
}

export function ModeSelect({ settings, onPickMode, onBack, onAdjust }: Props) {
  const pickSingle = (category: CategoryId, intensity: GameSettings['maxIntensity']) => {
    onPickMode({ allowedCategories: [category], maxIntensity: intensity })
  }

  const pickSurprise = () => {
    onPickMode({})
  }

  return (
    <div className="relative min-h-screen bg-afterdark p-6 pb-10">
      <ParticleField count={18} />
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 pt-2">
          <button onClick={onBack} className="text-sm text-[var(--text-dim)]">
            ← Retour
          </button>
          <h1 className="font-display text-xl text-white">Choisis ton mode</h1>
          <span className="w-10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => pickSingle(cat.id, cat.intensity)}
              className="glass-panel rounded-2xl p-5 text-left relative overflow-hidden group"
              style={{ boxShadow: `0 0 0 1px ${cat.glow}` }}
            >
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50"
                style={{ background: cat.color }}
              />
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="font-display text-xl text-white mb-1">{cat.label}</div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed mb-3">{cat.shortDesc}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span
                    key={idx}
                    className="h-1.5 w-5 rounded-full"
                    style={{ background: idx < cat.intensity ? cat.color : 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>
              <div className="mt-2 text-[11px] text-[var(--text-dim)]/70">
                {cardCountByCategory(cat.id)} cartes
              </div>
            </motion.button>
          ))}

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5 * 0.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={pickSurprise}
            className="glass-panel rounded-2xl p-5 text-left relative overflow-hidden sm:col-span-2"
          >
            <div className="text-3xl mb-2">🎲</div>
            <div className="font-display text-xl text-white mb-1">Surprise</div>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Le jeu pioche dans toutes les catégories et intensités que tu as
              autorisées dans « Personnaliser mon jeu » (actuellement jusqu'à
              « {CATEGORIES.find((c) => c.intensity === settings.maxIntensity)?.label} »).
            </p>
          </motion.button>
        </div>

        <div className="mt-8">
          <Button fullWidth onClick={onAdjust} variant="ghost">
            Ajuster mes préférences avant de jouer
          </Button>
        </div>
      </div>
    </div>
  )
}

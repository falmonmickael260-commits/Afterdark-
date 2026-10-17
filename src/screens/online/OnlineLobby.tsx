import { motion } from 'framer-motion'
import type { OnlineRoomEngine } from '../../online/useOnlineRoom'
import type { CategoryId } from '../../types/game'
import { CATEGORIES } from '../../data/categories'
import { Button } from '../../components/Button'
import { ChipGroup } from '../../components/ChipGroup'
import { Toggle } from '../../components/Toggle'
import { ParticleField } from '../../components/ParticleField'

interface Props {
  engine: OnlineRoomEngine
  onLeave: () => void
}

export function OnlineLobby({ engine, onLeave }: Props) {
  const { room, players, mySlot, startGame, updateSettings, leaveRoom, roomId } = engine
  if (!room) return null

  const isHost = mySlot === 0
  const bothPresent = Boolean(players[0] && players[1])

  const toggleCategory = (id: CategoryId) => {
    const has = room.settings.allowedCategories.includes(id)
    const next = has
      ? room.settings.allowedCategories.filter((c) => c !== id)
      : [...room.settings.allowedCategories, id]
    if (next.length === 0) return
    updateSettings({ allowedCategories: next })
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomId ?? '')
    } catch {
      // le presse-papiers n'est pas toujours disponible, le code reste visible à l'écran
    }
  }

  return (
    <div className="relative min-h-screen bg-afterdark p-6 pb-16">
      <ParticleField count={16} />
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6 pt-2">
          <button
            onClick={() => {
              leaveRoom()
              onLeave()
            }}
            className="text-sm text-[var(--text-dim)]"
          >
            ← Quitter
          </button>
          <h1 className="font-display text-xl text-white">Salon d'attente</h1>
          <span className="w-14" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-6 text-center mb-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-dim)] mb-2">
            Code de la room — partage-le à l'autre joueur
          </p>
          <button
            onClick={copyCode}
            className="font-display text-4xl sm:text-5xl text-gradient tracking-[0.3em] mb-1"
          >
            {roomId}
          </button>
          <p className="text-[11px] text-[var(--text-dim)]">Touche le code pour le copier</p>
        </motion.div>

        <div className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Joueurs</h2>
          <div className="flex flex-col gap-2">
            {[0, 1].map((slot) => {
              const p = players[slot as 0 | 1]
              return (
                <div
                  key={slot}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                    p ? 'border-[#ff2e63]/40 bg-[#ff2e63]/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="text-white">
                    {p ? p.name : `En attente du joueur ${slot + 1}…`}
                  </span>
                  {slot === mySlot && <span className="text-[11px] text-[var(--text-dim)]">toi</span>}
                </div>
              )
            })}
          </div>
        </div>

        {isHost ? (
          <>
            <div className="glass-panel rounded-2xl p-5 mb-4">
              <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Intensité maximale</h2>
              <ChipGroup
                options={CATEGORIES.map((c) => ({ value: String(c.intensity), label: `${c.emoji} ${c.label}` }))}
                value={String(room.settings.maxIntensity)}
                onChange={(v) => updateSettings({ maxIntensity: Number(v) as 1 | 2 | 3 | 4 | 5 })}
              />
            </div>

            <div className="glass-panel rounded-2xl p-5 mb-4">
              <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Catégories autorisées</h2>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => (
                  <Toggle
                    key={cat.id}
                    checked={room.settings.allowedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    label={`${cat.emoji} ${cat.label}`}
                    description={cat.shortDesc}
                  />
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 mb-4">
              <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Cartes spéciales</h2>
              <Toggle
                checked={room.settings.specialCardsEnabled}
                onChange={(v) => updateSettings({ specialCardsEnabled: v })}
                label="Mystère, Double Choix, Chrono, Inversée, Joker, Surprise"
              />
            </div>

            <Button fullWidth disabled={!bothPresent} onClick={startGame}>
              {bothPresent ? 'Démarrer la partie' : "En attente de l'autre joueur…"}
            </Button>
          </>
        ) : (
          <div className="glass-panel rounded-2xl p-5 text-center text-sm text-[var(--text-dim)]">
            {bothPresent
              ? "L'hôte configure la partie et va bientôt démarrer…"
              : "En attente qu'un deuxième joueur rejoigne avec le code…"}
          </div>
        )}
      </div>
    </div>
  )
}

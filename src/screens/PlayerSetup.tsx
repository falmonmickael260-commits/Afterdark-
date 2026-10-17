import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Attraction, Gender, Player } from '../types/game'
import { Button } from '../components/Button'
import { ChipGroup } from '../components/ChipGroup'
import { ParticleField } from '../components/ParticleField'

interface Props {
  players: [Player, Player]
  onUpdate: (id: 0 | 1, patch: Partial<Player>) => void
  onDone: () => void
  onBack: () => void
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
  { value: 'autre', label: 'Autre / ne pas préciser' },
]

const ATTRACTION_OPTIONS: { value: Attraction; label: string }[] = [
  { value: 'hommes', label: 'Hommes' },
  { value: 'femmes', label: 'Femmes' },
  { value: 'les deux', label: 'Les deux' },
  { value: 'non precise', label: 'Je préfère ne pas préciser' },
]

const INTENSITY_LABELS = ['Flirt', 'Gênant', 'Complices', 'Romance Intense', 'Confessions']

export function PlayerSetup({ players, onUpdate, onDone, onBack }: Props) {
  const [step, setStep] = useState<0 | 1>(0)
  const player = players[step]
  const canContinue = player.name.trim().length > 0

  const next = () => {
    ;(document.activeElement as HTMLElement | null)?.blur()
    if (step === 0) {
      setStep(1)
    } else {
      onDone()
    }
  }

  const back = () => {
    ;(document.activeElement as HTMLElement | null)?.blur()
    if (step === 1) setStep(0)
    else onBack()
  }

  return (
    <div className="relative min-h-screen bg-afterdark flex items-center justify-center p-6">
      <ParticleField count={16} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="glass-panel relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">
              Joueur {step + 1} / 2
            </span>
            <div className="flex gap-1">
              <span className={`h-1.5 w-8 rounded-full ${step >= 0 ? 'bg-[#ff2e63]' : 'bg-white/10'}`} />
              <span className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-[#9b5de5]' : 'bg-white/10'}`} />
            </div>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-white mb-6">
            Qui es-tu ?
          </h2>

          <label className="block text-sm text-[var(--text-dim)] mb-2">Pseudonyme</label>
          <input
            autoFocus
            value={player.name}
            onChange={(e) => onUpdate(step, { name: e.target.value })}
            placeholder="Ton prénom ou surnom"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-[var(--text-dim)]/50 outline-none focus:border-[#ff2e63] transition-colors mb-6"
            maxLength={24}
          />

          <label className="block text-sm text-[var(--text-dim)] mb-2">Sexe</label>
          <div className="mb-6">
            <ChipGroup
              options={GENDER_OPTIONS}
              value={player.gender}
              onChange={(v) => onUpdate(step, { gender: v })}
            />
          </div>

          <label className="block text-sm text-[var(--text-dim)] mb-2">
            Préférences d'attirance
          </label>
          <div className="mb-6">
            <ChipGroup
              options={ATTRACTION_OPTIONS}
              value={player.attraction}
              onChange={(v) => onUpdate(step, { attraction: v })}
            />
          </div>

          <label className="block text-sm text-[var(--text-dim)] mb-2">
            Niveau d'intensité souhaité : <span className="text-white">{INTENSITY_LABELS[player.intensityPref - 1]}</span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={player.intensityPref}
            onChange={(e) => onUpdate(step, { intensityPref: Number(e.target.value) as Player['intensityPref'] })}
            className="w-full accent-[#ff2e63] mb-8"
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={back} className="flex-1">
              Retour
            </Button>
            <Button onClick={next} disabled={!canContinue} className="flex-1">
              {step === 0 ? 'Continuer' : 'Valider'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

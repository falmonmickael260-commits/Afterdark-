import { useState } from 'react'
import { motion } from 'framer-motion'
import type { OnlineRoomEngine, OnlineProfileDraft } from '../../online/useOnlineRoom'
import type { Attraction, Gender } from '../../types/game'
import { Button } from '../../components/Button'
import { ChipGroup } from '../../components/ChipGroup'
import { ParticleField } from '../../components/ParticleField'

interface Props {
  engine: OnlineRoomEngine
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

export function OnlineLanding({ engine, onBack }: Props) {
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [profile, setProfile] = useState<OnlineProfileDraft>({
    name: '',
    gender: 'autre',
    attraction: 'non precise',
  })
  const [joinCode, setJoinCode] = useState('')

  if (!engine.configured) {
    return (
      <div className="relative min-h-screen bg-afterdark flex items-center justify-center p-6">
        <ParticleField count={10} />
        <div className="glass-panel relative z-10 max-w-md rounded-3xl p-8 text-center">
          <h1 className="font-display text-2xl text-white mb-4">Mode en ligne indisponible</h1>
          <p className="text-sm text-[var(--text-dim)] mb-6 leading-relaxed">
            Cet appareil n'a pas encore les clés Supabase configurées
            (<code className="text-[var(--pink)]">VITE_SUPABASE_URL</code> et{' '}
            <code className="text-[var(--pink)]">VITE_SUPABASE_ANON_KEY</code>). Voir le fichier{' '}
            <code className="text-[var(--pink)]">supabase/schema.sql</code> et le README pour la
            configuration.
          </p>
          <Button variant="secondary" fullWidth onClick={onBack}>
            Retour
          </Button>
        </div>
      </div>
    )
  }

  const canSubmit = profile.name.trim().length > 0 && (tab === 'create' || joinCode.trim().length >= 4)

  const submit = async () => {
    if (tab === 'create') {
      await engine.createRoom(profile)
    } else {
      await engine.joinRoom(joinCode, profile)
    }
  }

  return (
    <div className="relative min-h-screen bg-afterdark flex items-center justify-center p-6">
      <ParticleField count={16} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-sm text-[var(--text-dim)]">
            ← Retour
          </button>
          <h1 className="font-display text-xl text-white">Jouer en ligne</h1>
          <span className="w-10" />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium border ${
              tab === 'create'
                ? 'bg-gradient-to-r from-[#ff2e63] to-[#9b5de5] text-white border-transparent'
                : 'bg-white/5 text-[var(--text-dim)] border-white/10'
            }`}
          >
            Créer une room
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium border ${
              tab === 'join'
                ? 'bg-gradient-to-r from-[#ff2e63] to-[#9b5de5] text-white border-transparent'
                : 'bg-white/5 text-[var(--text-dim)] border-white/10'
            }`}
          >
            Rejoindre une room
          </button>
        </div>

        {tab === 'join' && (
          <div className="mb-6">
            <label className="block text-sm text-[var(--text-dim)] mb-2">Code de la room</label>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ex. K7P2M"
              maxLength={8}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white tracking-[0.3em] text-center uppercase placeholder:text-[var(--text-dim)]/50 outline-none focus:border-[#ff2e63] transition-colors"
            />
          </div>
        )}

        <label className="block text-sm text-[var(--text-dim)] mb-2">Ton pseudonyme</label>
        <input
          value={profile.name}
          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          placeholder="Ton prénom ou surnom"
          maxLength={24}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-[var(--text-dim)]/50 outline-none focus:border-[#ff2e63] transition-colors mb-6"
        />

        <label className="block text-sm text-[var(--text-dim)] mb-2">Sexe</label>
        <div className="mb-6">
          <ChipGroup
            options={GENDER_OPTIONS}
            value={profile.gender}
            onChange={(v) => setProfile((p) => ({ ...p, gender: v }))}
          />
        </div>

        <label className="block text-sm text-[var(--text-dim)] mb-2">Préférences d'attirance</label>
        <div className="mb-8">
          <ChipGroup
            options={ATTRACTION_OPTIONS}
            value={profile.attraction}
            onChange={(v) => setProfile((p) => ({ ...p, attraction: v }))}
          />
        </div>

        {engine.error && (
          <div className="mb-4 text-sm text-[var(--pink)] text-center">{engine.error}</div>
        )}

        <Button fullWidth disabled={!canSubmit || engine.busy} onClick={submit}>
          {engine.busy ? 'Un instant…' : tab === 'create' ? 'Créer la room' : 'Rejoindre'}
        </Button>
      </motion.div>
    </div>
  )
}

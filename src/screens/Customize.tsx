import { useState } from 'react'
import type { AfterDarkEngine } from '../hooks/useAfterDark'
import type { CardKind, CategoryId } from '../types/game'
import { CATEGORIES } from '../data/categories'
import { Button } from '../components/Button'
import { ChipGroup } from '../components/ChipGroup'
import { Toggle } from '../components/Toggle'
import { ParticleField } from '../components/ParticleField'

interface Props {
  engine: AfterDarkEngine
  onBack: () => void
}

export function Customize({ engine, onBack }: Props) {
  const { settings, updateSettings, customCards, addCustomCard, removeCustomCard } = engine

  const [draftCategory, setDraftCategory] = useState<CategoryId>('flirt')
  const [draftType, setDraftType] = useState<CardKind>('verite')
  const [draftText, setDraftText] = useState('')

  const toggleCategory = (id: CategoryId) => {
    const has = settings.allowedCategories.includes(id)
    const next = has
      ? settings.allowedCategories.filter((c) => c !== id)
      : [...settings.allowedCategories, id]
    if (next.length === 0) return
    updateSettings({ allowedCategories: next })
  }

  const submitCustomCard = () => {
    if (!draftText.trim()) return
    const cat = CATEGORIES.find((c) => c.id === draftCategory)!
    addCustomCard({
      type: draftType,
      category: draftCategory,
      intensity: cat.intensity,
      text: draftText.trim(),
    })
    setDraftText('')
  }

  return (
    <div className="relative min-h-screen bg-afterdark p-6 pb-16">
      <ParticleField count={10} />
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6 pt-2">
          <button onClick={onBack} className="text-sm text-[var(--text-dim)]">
            ← Retour
          </button>
          <h1 className="font-display text-xl text-white">Personnaliser mon jeu</h1>
          <span className="w-10" />
        </div>

        <section className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Intensité maximale</h2>
          <ChipGroup
            options={CATEGORIES.map((c) => ({ value: String(c.intensity), label: `${c.emoji} ${c.label}` }))}
            value={String(settings.maxIntensity)}
            onChange={(v) => updateSettings({ maxIntensity: Number(v) as 1 | 2 | 3 | 4 | 5 })}
          />
        </section>

        <section className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Catégories autorisées</h2>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((cat) => (
              <Toggle
                key={cat.id}
                checked={settings.allowedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                label={`${cat.emoji} ${cat.label}`}
                description={cat.shortDesc}
              />
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Joker</h2>
          <p className="text-xs text-[var(--text-dim)] leading-relaxed">
            Il n'y a pas de passe libre : chaque joueur gagne automatiquement
            le droit à un 🃏 Joker (passer une carte) toutes les 5 cartes
            qu'il a jouées. Aucune limite de temps ou de tours n'est imposée —
            c'est vous qui décidez quand arrêter la partie.
          </p>
        </section>

        <section className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Mode de tirage des tours</h2>
          <ChipGroup
            options={[
              { value: 'alterne', label: 'Alterné' },
              { value: 'aleatoire', label: 'Aléatoire' },
            ]}
            value={settings.drawMode}
            onChange={(v) => updateSettings({ drawMode: v as 'alterne' | 'aleatoire' })}
          />
        </section>

        <section className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">Options</h2>
          <Toggle
            checked={settings.soundEnabled}
            onChange={(v) => updateSettings({ soundEnabled: v })}
            label="Sons"
          />
          <Toggle
            checked={settings.animationsEnabled}
            onChange={(v) => updateSettings({ animationsEnabled: v })}
            label="Animations"
            description="Désactive les transitions si tu préfères un affichage instantané."
          />
          <Toggle
            checked={settings.secretCardMode}
            onChange={(v) => updateSettings({ secretCardMode: v })}
            label="Mode carte secrète"
            description="Lis ta carte seul·e avant de décider de la révéler."
          />
          <Toggle
            checked={settings.specialCardsEnabled}
            onChange={(v) => updateSettings({ specialCardsEnabled: v })}
            label="Cartes spéciales"
            description="Mystère, Double Choix, Chrono, Inversée, Joker, Surprise."
          />
        </section>

        <section className="glass-panel rounded-2xl p-5">
          <h2 className="text-sm uppercase tracking-wide text-[var(--text-dim)] mb-3">
            Créer une carte personnalisée
          </h2>
          <div className="mb-3">
            <ChipGroup
              options={CATEGORIES.map((c) => ({ value: c.id, label: `${c.emoji} ${c.label}` }))}
              value={draftCategory}
              onChange={(v) => setDraftCategory(v as CategoryId)}
            />
          </div>
          <div className="mb-3">
            <ChipGroup
              options={[
                { value: 'verite', label: 'Vérité' },
                { value: 'action', label: 'Action' },
              ]}
              value={draftType}
              onChange={(v) => setDraftType(v as CardKind)}
            />
          </div>
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Écris ta propre vérité ou action…"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-[var(--text-dim)]/50 outline-none focus:border-[#ff2e63] mb-3 resize-none"
            rows={3}
            maxLength={280}
          />
          <Button onClick={submitCustomCard} fullWidth variant="secondary">
            Ajouter cette carte
          </Button>

          {customCards.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 max-h-40 overflow-y-auto scrollbar-thin">
              {customCards.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-xs text-[var(--text-dim)] line-clamp-2">{c.text}</span>
                  <button
                    onClick={() => removeCustomCard(c.id)}
                    className="text-[11px] text-[var(--pink)] shrink-0"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

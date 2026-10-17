import { ParticleField } from '../components/ParticleField'
import { CATEGORIES } from '../data/categories'

interface Props {
  onBack: () => void
}

const LIMITS = [
  "Le bouton « Autre carte » est disponible sur toute carte, gratuitement et sans limite, pour en recevoir une différente.",
  "Pour passer complètement un tour sans y répondre, chaque joueur dispose d'un 🃏 Joker gagné automatiquement toutes les 5 cartes jouées — cela évite que la partie devienne trop facile, sans jamais forcer quoi que ce soit : vous pouvez toujours refuser verbalement, à tout moment.",
  "Aucun contact physique n'est jamais imposé — les actions qui le suggèrent demandent l'accord explicite des deux joueurs.",
  "Aucun défi intime, aucune photo ou vidéo, aucune obligation de montrer son téléphone n'est jamais demandé.",
  "Aucune donnée personnelle n'est collectée : tout reste sur cet appareil.",
  "La partie n'a pas de fin imposée par le jeu : c'est vous qui décidez, ensemble, quand l'arrêter.",
]

export function Rules({ onBack }: Props) {
  return (
    <div className="relative min-h-screen bg-afterdark p-6 pb-16">
      <ParticleField count={10} />
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6 pt-2">
          <button onClick={onBack} className="text-sm text-[var(--text-dim)]">
            ← Retour
          </button>
          <h1 className="font-display text-xl text-white">Règles &amp; consentement</h1>
          <span className="w-10" />
        </div>

        <section className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="font-display text-lg text-white mb-2">Comment jouer</h2>
          <ol className="list-decimal list-inside text-sm text-[var(--text-dim)] space-y-1.5 leading-relaxed">
            <li>Configurez les deux profils de joueurs et choisissez vos préférences.</li>
            <li>Choisissez un mode, ou personnalisez l'intensité et les catégories autorisées.</li>
            <li>À chaque tour, le joueur actif choisit « Action » ou « Vérité ».</li>
            <li>Une carte est tirée et révélée avec une animation.</li>
            <li>Répondez, réalisez le défi, ou passez — puis validez pour passer au tour suivant.</li>
          </ol>
        </section>

        <section className="glass-panel rounded-2xl p-5 mb-4">
          <h2 className="font-display text-lg text-white mb-2">Les 5 niveaux</h2>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-start gap-3">
                <span className="text-xl">{cat.emoji}</span>
                <div>
                  <div className="text-sm text-white font-medium">{cat.label}</div>
                  <div className="text-xs text-[var(--text-dim)]">{cat.shortDesc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5">
          <h2 className="font-display text-lg text-white mb-2">Consentement &amp; limites</h2>
          <p className="text-xs text-[var(--text-dim)] mb-3 leading-relaxed">
            AFTER DARK est un espace de divertissement entre adultes
            consentants. Ces règles ne sont pas négociables en cours de
            partie :
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--text-dim)] space-y-1.5 leading-relaxed">
            {LIMITS.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

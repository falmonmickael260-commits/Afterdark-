import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../components/Logo'
import { ParticleField } from '../components/ParticleField'
import { Button } from '../components/Button'

interface Props {
  onConfirm: () => void
  onDecline: () => void
}

export function AgeGate({ onConfirm, onDecline }: Props) {
  const [declined, setDeclined] = useState(false)

  if (declined) {
    return (
      <div className="relative min-h-screen bg-afterdark flex items-center justify-center p-6">
        <ParticleField count={10} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel relative z-10 max-w-md rounded-3xl p-8 text-center"
        >
          <h1 className="font-display text-2xl text-white mb-4">Accès réservé aux adultes</h1>
          <p className="text-[var(--text-dim)] mb-6 leading-relaxed">
            L'accès à AFTER DARK est réservé aux personnes majeures.
          </p>
          <Button variant="secondary" onClick={() => setDeclined(false)} fullWidth>
            Retour
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-afterdark flex items-center justify-center p-6">
      <ParticleField count={28} />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel relative z-10 w-full max-w-lg rounded-3xl p-8 sm:p-10 text-center"
        >
          <Logo />

          <p className="mt-8 text-sm sm:text-base text-[var(--text-dim)] leading-relaxed">
            AFTER DARK est un jeu réservé aux adultes. Il contient des questions
            personnelles, des confidences intimes et des défis osés, pensés
            pour les couples. Tu dois avoir au moins 18 ans pour continuer.
          </p>

          <h2 className="mt-8 font-display text-xl sm:text-2xl text-white">
            As-tu 18 ans ou plus ?
          </h2>

          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={onConfirm} fullWidth>
              Oui, j'ai 18 ans ou plus
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setDeclined(true)
                onDecline()
              }}
            >
              Non, j'ai moins de 18 ans
            </Button>
          </div>

          <p className="mt-6 text-[11px] text-[var(--text-dim)]/70 leading-relaxed">
            Cette étape enregistre une simple déclaration de majorité sur cet
            appareil. Elle ne vérifie pas réellement ton âge et ne te demande
            aucune pièce d'identité ni donnée personnelle.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

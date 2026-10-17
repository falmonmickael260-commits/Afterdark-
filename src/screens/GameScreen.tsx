import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AfterDarkEngine } from '../hooks/useAfterDark'
import { ProgressHeader } from '../components/ProgressHeader'
import { GameCard } from '../components/GameCard'
import { CardShuffleLoader } from '../components/CardShuffleLoader'
import { Button } from '../components/Button'
import { ParticleField } from '../components/ParticleField'

interface Props {
  engine: AfterDarkEngine
}

export function GameScreen({ engine }: Props) {
  const {
    players,
    currentPlayerIndex,
    turnNumber,
    history,
    settings,
    currentCard,
    cardRevealed,
    secretPhase,
    isDrawing,
    draw,
    revealCard,
    finishReadingSecretly,
    completeTurn,
    requestAnotherCard,
    cancelDraw,
    availableJokers,
    deckReshuffled,
    endGame,
  } = engine

  const [confirmQuit, setConfirmQuit] = useState(false)
  const canUseJoker = availableJokers[currentPlayerIndex] > 0

  useEffect(() => {
    if (currentCard && !cardRevealed && secretPhase === null && !settings.secretCardMode) {
      const t = setTimeout(() => revealCard(), settings.animationsEnabled ? 500 : 0)
      return () => clearTimeout(t)
    }
  }, [currentCard, cardRevealed, secretPhase, settings.secretCardMode, settings.animationsEnabled, revealCard])

  const isHiddenToReader =
    !!currentCard && settings.secretCardMode && secretPhase === 'reading' && !cardRevealed

  return (
    <div className="relative min-h-screen bg-afterdark p-6 pb-10 flex flex-col">
      <ParticleField count={14} />

      <div className="relative z-10 flex-1 flex flex-col">
        <ProgressHeader
          players={players}
          activePlayerIndex={currentPlayerIndex}
          turnNumber={turnNumber}
          cardsPlayed={history.length}
          maxIntensity={settings.maxIntensity}
          availableJokers={availableJokers}
          onQuit={() => setConfirmQuit(true)}
        />

        {deckReshuffled && (
          <div className="max-w-sm mx-auto w-full mb-3 text-center text-[11px] text-[var(--text-dim)]">
            La pioche a été remélangée — toutes les cartes de cette sélection ont déjà été vues.
          </div>
        )}

        <div className="flex-1 flex items-center justify-center py-4">
          {isDrawing ? (
            <CardShuffleLoader />
          ) : (
            <GameCard
              card={currentCard}
              revealed={!!currentCard && (settings.secretCardMode ? secretPhase !== 'reading' && cardRevealed : cardRevealed)}
              animationsEnabled={settings.animationsEnabled}
              hidden={isHiddenToReader}
            />
          )}
        </div>

        <div className="max-w-sm mx-auto w-full">
          <AnimatePresence mode="wait">
            {!currentCard && !isDrawing && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <p className="text-center font-display text-xl text-white mb-1">
                  Action ou Vérité ?
                </p>
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => draw('verite')}>
                    Vérité
                  </Button>
                  <Button className="flex-1" onClick={() => draw('action')} variant="secondary">
                    Action
                  </Button>
                </div>
              </motion.div>
            )}

            {currentCard && settings.secretCardMode && secretPhase === 'reading' && (
              <motion.div
                key="secret-reading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Button fullWidth onClick={finishReadingSecretly}>
                  J'ai terminé de lire
                </Button>
              </motion.div>
            )}

            {currentCard && settings.secretCardMode && secretPhase === 'ready-to-reveal' && (
              <motion.div
                key="secret-reveal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <Button fullWidth onClick={revealCard}>
                  Révéler la carte à l'autre
                </Button>
                <Button fullWidth variant="ghost" onClick={() => completeTurn('done')}>
                  Garder secret et valider le tour
                </Button>
              </motion.div>
            )}

            {currentCard && cardRevealed && (!settings.secretCardMode || secretPhase === null) && (
              <motion.div
                key="resolved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <Button fullWidth onClick={() => completeTurn('done')}>
                  {currentCard.type === 'verite' ? "J'ai répondu" : "C'est fait"}
                </Button>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    variant="secondary"
                    disabled={!canUseJoker}
                    onClick={() => completeTurn('joker')}
                  >
                    🃏 Joker {canUseJoker ? '' : `(0 dispo)`}
                  </Button>
                  <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={() => requestAnotherCard(currentCard.type)}
                  >
                    Autre carte
                  </Button>
                </div>
                <Button fullWidth variant="ghost" onClick={cancelDraw}>
                  Retour
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {confirmQuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel rounded-2xl p-6 max-w-sm text-center"
            >
              <p className="font-display text-xl text-white mb-4">
                Arrêter la partie ?
              </p>
              <p className="text-sm text-[var(--text-dim)] mb-6">
                C'est vous qui décidez quand vous arrêter — aucune limite n'est imposée par le jeu.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirmQuit(false)}>
                  Continuer à jouer
                </Button>
                <Button variant="danger" className="flex-1" onClick={endGame}>
                  Terminer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

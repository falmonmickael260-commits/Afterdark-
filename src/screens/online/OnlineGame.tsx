import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { OnlineRoomEngine } from '../../online/useOnlineRoom'
import { GameCard } from '../../components/GameCard'
import { CardShuffleLoader } from '../../components/CardShuffleLoader'
import { Button } from '../../components/Button'
import { ParticleField } from '../../components/ParticleField'
import { CATEGORIES } from '../../data/categories'

interface Props {
  engine: OnlineRoomEngine
  onEnded: () => void
}

export function OnlineGame({ engine, onEnded }: Props) {
  const {
    room,
    players,
    mySlot,
    isAsker,
    isTarget,
    availableJokers,
    askerChoose,
    targetRequestAnother,
    submitResponse,
    nextTurn,
    endRoom,
  } = engine

  const [answerText, setAnswerText] = useState('')
  const [confirmQuit, setConfirmQuit] = useState(false)
  const [pending, setPending] = useState(false)

  if (!room || mySlot === null) return null

  if (room.status === 'ended') {
    return (
      <div className="relative min-h-screen bg-afterdark flex items-center justify-center p-6">
        <ParticleField count={20} />
        <div className="glass-panel relative z-10 max-w-sm rounded-3xl p-8 text-center">
          <h2 className="font-display text-2xl text-white mb-4">Partie terminée</h2>
          <p className="text-sm text-[var(--text-dim)] mb-6">
            {room.history.length} cartes jouées ensemble.
          </p>
          <Button fullWidth onClick={onEnded}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  const askerPlayer = players[room.asker_slot]
  const targetSlot = (1 - room.asker_slot) as 0 | 1
  const targetPlayer = players[targetSlot]
  const myJokers = availableJokers[mySlot]
  const intensityCat = CATEGORIES.find((c) => c.intensity === room.settings.maxIntensity)

  const runPending = async (fn: () => Promise<void>) => {
    setPending(true)
    try {
      await fn()
    } finally {
      setPending(false)
      setAnswerText('')
    }
  }

  return (
    <div className="relative min-h-screen bg-afterdark p-6 pb-10 flex flex-col">
      <ParticleField count={14} />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="w-full max-w-sm mx-auto mb-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-dim)] mb-2">
            <span>Tour {room.turn_number}</span>
            <button onClick={() => setConfirmQuit(true)} className="hover:text-white">
              Arrêter la partie
            </button>
          </div>
          <div className="font-display text-lg text-white mb-2">
            <span className="text-gradient">{askerPlayer?.name ?? 'Joueur'}</span> interroge{' '}
            <span className="text-gradient">{targetPlayer?.name ?? 'Joueur'}</span>
          </div>
          <div className="text-[11px] text-[var(--text-dim)] mb-2">
            Intensité max : {intensityCat?.emoji} {intensityCat?.label}
          </div>
          <div className="flex items-center justify-between gap-2">
            {[0, 1].map((slot) => (
              <div
                key={slot}
                className={`flex-1 flex items-center justify-between rounded-xl px-3 py-1.5 border text-[11px] ${
                  slot === mySlot ? 'border-[#ff2e63]/50 bg-[#ff2e63]/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <span className="text-[var(--text-dim)] truncate">
                  {players[slot as 0 | 1]?.name ?? `Joueur ${slot + 1}`}
                  {slot === mySlot ? ' (toi)' : ''}
                </span>
                <span className="text-white font-medium shrink-0 ml-2">🃏 {availableJokers[slot as 0 | 1]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-4">
          {pending ? (
            <CardShuffleLoader />
          ) : room.turn_status === 'idle' ? (
            <div className="text-center text-[var(--text-dim)]">
              {isAsker ? 'À toi de choisir…' : `${askerPlayer?.name ?? 'Il/elle'} choisit en ce moment…`}
            </div>
          ) : (
            <GameCard card={room.card} revealed animationsEnabled hidden={false} />
          )}
        </div>

        <div className="max-w-sm mx-auto w-full">
          <AnimatePresence mode="wait">
            {!pending && room.turn_status === 'idle' && isAsker && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <p className="text-center font-display text-xl text-white mb-1">Action ou Vérité ?</p>
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => runPending(() => askerChoose('verite'))}>
                    Vérité
                  </Button>
                  <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={() => runPending(() => askerChoose('action'))}
                  >
                    Action
                  </Button>
                </div>
              </motion.div>
            )}

            {!pending && room.turn_status === 'idle' && isTarget && (
              <motion.div
                key="waiting-choice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-[var(--text-dim)]"
              >
                Patiente, ça arrive…
              </motion.div>
            )}

            {!pending && room.turn_status === 'awaiting_response' && isTarget && room.card && (
              <motion.div
                key="respond"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                {room.card.type === 'verite' ? (
                  <>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Écris ta réponse…"
                      rows={3}
                      maxLength={400}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-[var(--text-dim)]/50 outline-none focus:border-[#ff2e63] resize-none"
                    />
                    <Button
                      fullWidth
                      disabled={!answerText.trim()}
                      onClick={() => runPending(() => submitResponse({ type: 'text', value: answerText.trim() }))}
                    >
                      Envoyer ma réponse
                    </Button>
                  </>
                ) : (
                  <Button fullWidth onClick={() => runPending(() => submitResponse({ type: 'done' }))}>
                    C'est fait
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    variant="secondary"
                    disabled={myJokers <= 0}
                    onClick={() => runPending(() => submitResponse({ type: 'joker' }))}
                  >
                    🃏 Joker {myJokers > 0 ? '' : '(0 dispo)'}
                  </Button>
                  <Button className="flex-1" variant="secondary" onClick={() => runPending(() => targetRequestAnother())}>
                    Autre carte
                  </Button>
                </div>
              </motion.div>
            )}

            {!pending && room.turn_status === 'awaiting_response' && isAsker && (
              <motion.div
                key="waiting-response"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-[var(--text-dim)]"
              >
                En attente de la réponse de {targetPlayer?.name ?? "l'autre joueur"}…
              </motion.div>
            )}

            {!pending && room.turn_status === 'resolved' && (
              <motion.div
                key="resolved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="glass-panel rounded-xl p-4 text-center">
                  {room.response?.type === 'text' && (
                    <p className="text-white text-sm leading-relaxed">« {room.response.value} »</p>
                  )}
                  {room.response?.type === 'done' && (
                    <p className="text-white text-sm">✅ {targetPlayer?.name ?? "L'autre joueur"} a réalisé l'action.</p>
                  )}
                  {room.response?.type === 'joker' && (
                    <p className="text-white text-sm">🃏 {targetPlayer?.name ?? "L'autre joueur"} a utilisé un joker.</p>
                  )}
                </div>
                {isAsker ? (
                  <Button fullWidth onClick={() => runPending(() => nextTurn())}>
                    Tour suivant
                  </Button>
                ) : (
                  <p className="text-center text-xs text-[var(--text-dim)]">
                    En attente que {askerPlayer?.name ?? "l'autre joueur"} passe au tour suivant…
                  </p>
                )}
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
              <p className="font-display text-xl text-white mb-4">Arrêter la partie ?</p>
              <p className="text-sm text-[var(--text-dim)] mb-6">Ça arrête la partie pour vous deux.</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirmQuit(false)}>
                  Continuer à jouer
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => endRoom()}>
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

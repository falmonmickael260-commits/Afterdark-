import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  Card,
  CardKind,
  CategoryId,
  GamePhase,
  GameSettings,
  Player,
  TurnRecord,
} from '../types/game'
import { TURNS_PER_JOKER } from '../types/game'
import { ALL_CARDS } from '../data/cards'
import { DEFAULT_SETTINGS, defaultPlayer } from '../data/defaults'
import { drawCard, filterPool } from '../lib/deck'
import {
  getMajorityDeclared,
  loadJSON,
  saveJSON,
  setMajorityDeclared,
  STORAGE_KEYS,
} from '../lib/storage'

const MIN_BOOT_MS = 1600

export function useAfterDark() {
  const [phase, setPhase] = useState<GamePhase>('boot')
  const [majorityConfirmed, setMajorityConfirmed] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)

  const [players, setPlayers] = useState<[Player, Player]>(() => {
    const saved = loadJSON<[Player, Player]>(STORAGE_KEYS.players)
    return saved ?? [defaultPlayer(0), defaultPlayer(1)]
  })

  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = loadJSON<GameSettings>(STORAGE_KEYS.settings)
    return saved ?? DEFAULT_SETTINGS
  })

  const [customCards, setCustomCards] = useState<Card[]>(() => loadJSON<Card[]>(STORAGE_KEYS.customCards) ?? [])

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<0 | 1>(0)
  const [turnNumber, setTurnNumber] = useState(1)
  const [played, setPlayed] = useState<Set<string>>(new Set())
  const [tempExcluded, setTempExcluded] = useState<Set<string>>(new Set())
  const [lastCategory, setLastCategory] = useState<CategoryId | null>(null)
  const [history, setHistory] = useState<TurnRecord[]>([])
  const [turnsPlayed, setTurnsPlayed] = useState<[number, number]>([0, 0])
  const [jokersUsed, setJokersUsed] = useState<[number, number]>([0, 0])
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [cardRevealed, setCardRevealed] = useState(false)
  const [secretPhase, setSecretPhase] = useState<'reading' | 'ready-to-reveal' | null>(null)
  const [deckReshuffled, setDeckReshuffled] = useState(false)

  useEffect(() => {
    const declared = getMajorityDeclared()
    const startedAt = Date.now()
    const reveal = () => {
      setMajorityConfirmed(declared)
      setPhase(declared ? 'home' : 'age-gate')
    }
    const elapsed = Date.now() - startedAt
    const remaining = Math.max(0, MIN_BOOT_MS - elapsed)
    const t = setTimeout(reveal, remaining)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    saveJSON(STORAGE_KEYS.players, players)
  }, [players])

  useEffect(() => {
    saveJSON(STORAGE_KEYS.settings, settings)
  }, [settings])

  useEffect(() => {
    saveJSON(STORAGE_KEYS.customCards, customCards)
  }, [customCards])

  const addCustomCard = useCallback(
    (card: Omit<Card, 'id'>) => {
      const newCard: Card = { ...card, id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
      setCustomCards((prev) => [...prev, newCard])
    },
    [],
  )

  const removeCustomCard = useCallback((id: string) => {
    setCustomCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const confirmMajority = useCallback(() => {
    setMajorityDeclared(true)
    setMajorityConfirmed(true)
    setPhase('home')
  }, [])

  const declineMajority = useCallback(() => {
    setMajorityDeclared(false)
    setMajorityConfirmed(false)
    setPhase('age-gate')
  }, [])

  const resetMajority = useCallback(() => {
    setMajorityDeclared(false)
    setMajorityConfirmed(false)
    setPhase('age-gate')
  }, [])

  const goTo = useCallback((next: GamePhase) => setPhase(next), [])

  const updatePlayer = useCallback((id: 0 | 1, patch: Partial<Player>) => {
    setPlayers((prev) => {
      const copy = [...prev] as [Player, Player]
      copy[id] = { ...copy[id], ...patch }
      return copy
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const pool = useMemo(
    () =>
      filterPool([...ALL_CARDS, ...customCards], {
        allowedCategories: settings.allowedCategories,
        maxIntensity: settings.maxIntensity,
        includeSpecial: settings.specialCardsEnabled,
      }),
    [settings.allowedCategories, settings.maxIntensity, settings.specialCardsEnabled, customCards],
  )

  const startGame = useCallback(() => {
    setPlayed(new Set())
    setTempExcluded(new Set())
    setLastCategory(null)
    setHistory([])
    setTurnsPlayed([0, 0])
    setJokersUsed([0, 0])
    setCurrentCard(null)
    setCardRevealed(false)
    setSecretPhase(null)
    setTurnNumber(1)
    setCurrentPlayerIndex(0)
    setPhase('playing')
  }, [])

  const draw = useCallback(
    (kind: CardKind) => {
      const resolve = () => {
        const kindPool = pool.filter((c) => !c.special && c.type === kind).concat(
          pool.filter((c) => c.special),
        )
        const result = drawCard(kindPool, played, tempExcluded, lastCategory)
        setDeckReshuffled(result.deckWasReshuffled)
        setCurrentCard(result.card)
        setCardRevealed(false)
        setSecretPhase(settings.secretCardMode ? 'reading' : null)
        if (result.card) {
          setLastCategory(result.card.category)
        }
        setIsDrawing(false)
      }

      if (!settings.animationsEnabled) {
        resolve()
        return
      }

      setIsDrawing(true)
      setTimeout(resolve, 900)
    },
    [pool, played, tempExcluded, lastCategory, settings.secretCardMode, settings.animationsEnabled],
  )

  const revealCard = useCallback(() => {
    setCardRevealed(true)
    setSecretPhase(null)
  }, [])

  const finishReadingSecretly = useCallback(() => {
    setSecretPhase('ready-to-reveal')
  }, [])

  /** Jokers gagnés par un joueur = un pour chaque tranche de TURNS_PER_JOKER tours qu'il a joués, moins ceux déjà utilisés. */
  const availableJokers = useMemo<[number, number]>(
    () => [
      Math.max(0, Math.floor(turnsPlayed[0] / TURNS_PER_JOKER) - jokersUsed[0]),
      Math.max(0, Math.floor(turnsPlayed[1] / TURNS_PER_JOKER) - jokersUsed[1]),
    ],
    [turnsPlayed, jokersUsed],
  )

  const completeTurn = useCallback(
    (outcome: 'done' | 'joker') => {
      if (!currentCard) return
      if (outcome === 'joker' && availableJokers[currentPlayerIndex] <= 0) return

      setPlayed((prev) => new Set(prev).add(currentCard.id))
      if (outcome === 'joker') {
        setTempExcluded((prev) => new Set(prev).add(currentCard.id))
        setJokersUsed((prev) => {
          const copy = [...prev] as [number, number]
          copy[currentPlayerIndex] += 1
          return copy
        })
      }
      setHistory((prev) => [
        ...prev,
        {
          cardId: currentCard.id,
          playerIndex: currentPlayerIndex,
          choice: currentCard.type,
          outcome,
        },
      ])
      setTurnsPlayed((prev) => {
        const copy = [...prev] as [number, number]
        copy[currentPlayerIndex] += 1
        return copy
      })
      setCurrentCard(null)
      setCardRevealed(false)
      setSecretPhase(null)
      setCurrentPlayerIndex((prev) => {
        if (settings.drawMode === 'aleatoire') {
          return Math.random() < 0.5 ? 0 : 1
        }
        return prev === 0 ? 1 : 0
      })
      setTurnNumber((prev) => prev + 1)
    },
    [currentCard, currentPlayerIndex, settings.drawMode, availableJokers],
  )

  const requestAnotherCard = useCallback(
    (kind: CardKind) => {
      if (currentCard) {
        setTempExcluded((prev) => new Set(prev).add(currentCard.id))
      }
      draw(kind)
    },
    [currentCard, draw],
  )

  const cancelDraw = useCallback(() => {
    setCurrentCard(null)
    setCardRevealed(false)
    setSecretPhase(null)
  }, [])

  const endGame = useCallback(() => {
    setPhase('ended')
  }, [])

  const backToHome = useCallback(() => {
    setPhase('home')
  }, [])

  return {
    phase,
    goTo,
    majorityConfirmed,
    confirmMajority,
    declineMajority,
    resetMajority,
    players,
    updatePlayer,
    settings,
    updateSettings,
    pool,
    startGame,
    currentPlayerIndex,
    turnNumber,
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
    history,
    deckReshuffled,
    endGame,
    backToHome,
    customCards,
    addCustomCard,
    removeCustomCard,
  }
}

export type AfterDarkEngine = ReturnType<typeof useAfterDark>

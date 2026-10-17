export type CardKind = 'verite' | 'action'

export type CategoryId = 'flirt' | 'genant' | 'complices' | 'intense' | 'confessions'

export type SpecialKind = 'mystere' | 'double' | 'chrono' | 'inversee' | 'joker' | 'surprise'

export interface Category {
  id: CategoryId
  label: string
  emoji: string
  intensity: 1 | 2 | 3 | 4 | 5
  shortDesc: string
  color: string
  glow: string
}

export interface Card {
  id: string
  type: CardKind
  category: CategoryId
  intensity: 1 | 2 | 3 | 4 | 5
  text: string
  duration?: number
  requiresConsent?: boolean
  special?: SpecialKind
  tags?: string[]
}

export type Gender = 'homme' | 'femme' | 'autre'
export type Attraction = 'hommes' | 'femmes' | 'les deux' | 'non precise'

export interface Player {
  id: 0 | 1
  name: string
  gender: Gender
  attraction: Attraction
  intensityPref: 1 | 2 | 3 | 4 | 5
}

export type DrawMode = 'alterne' | 'aleatoire'

export interface GameSettings {
  maxIntensity: 1 | 2 | 3 | 4 | 5
  allowedCategories: CategoryId[]
  drawMode: DrawMode
  soundEnabled: boolean
  animationsEnabled: boolean
  secretCardMode: boolean
  specialCardsEnabled: boolean
}

/** Chaque joueur gagne le droit à un Joker (= passer une carte) tous les 5 tours qu'il a joués. */
export const TURNS_PER_JOKER = 5

export type GamePhase =
  | 'boot'
  | 'age-gate'
  | 'home'
  | 'setup'
  | 'mode-select'
  | 'customize'
  | 'rules'
  | 'playing'
  | 'ended'

export interface TurnRecord {
  cardId: string
  playerIndex: 0 | 1
  choice: CardKind
  outcome: 'done' | 'joker'
}

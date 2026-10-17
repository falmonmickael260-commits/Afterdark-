import type { GameSettings, Player } from '../types/game'

export const DEFAULT_SETTINGS: GameSettings = {
  maxIntensity: 3,
  allowedCategories: ['flirt', 'genant', 'complices'],
  drawMode: 'alterne',
  soundEnabled: true,
  animationsEnabled: true,
  secretCardMode: false,
  specialCardsEnabled: true,
}

export function defaultPlayer(id: 0 | 1): Player {
  return {
    id,
    name: '',
    gender: 'autre',
    attraction: 'non precise',
    intensityPref: 3,
  }
}

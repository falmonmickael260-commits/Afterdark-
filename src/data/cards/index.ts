import { FLIRT_CARDS } from './flirt'
import { GENANT_CARDS } from './genant'
import { COMPLICES_CARDS } from './complices'
import { INTENSE_CARDS } from './intense'
import { CONFESSIONS_CARDS } from './confessions'
import { SPECIAL_CARDS } from './special'
import type { Card, CategoryId } from '../../types/game'

export const MAIN_CARDS: Card[] = [
  ...FLIRT_CARDS,
  ...GENANT_CARDS,
  ...COMPLICES_CARDS,
  ...INTENSE_CARDS,
  ...CONFESSIONS_CARDS,
]

export const ALL_CARDS: Card[] = [...MAIN_CARDS, ...SPECIAL_CARDS]

export function cardCountByCategory(category: CategoryId): number {
  return MAIN_CARDS.filter((c) => c.category === category).length
}

export const LIBRARY_STATS = {
  total: ALL_CARDS.length,
  mainTotal: MAIN_CARDS.length,
  specialTotal: SPECIAL_CARDS.length,
  byCategory: (['flirt', 'genant', 'complices', 'intense', 'confessions'] as CategoryId[]).map(
    (category) => ({
      category,
      verites: MAIN_CARDS.filter((c) => c.category === category && c.type === 'verite').length,
      actions: MAIN_CARDS.filter((c) => c.category === category && c.type === 'action').length,
    }),
  ),
}

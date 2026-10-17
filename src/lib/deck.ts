import type { Card, CardKind, CategoryId } from '../types/game'

export interface DrawFilters {
  allowedCategories: CategoryId[]
  maxIntensity: 1 | 2 | 3 | 4 | 5
  kind?: CardKind
  includeSpecial: boolean
}

export interface DrawResult {
  card: Card | null
  deckWasReshuffled: boolean
  categoryExhausted: boolean
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

export function filterPool(allCards: Card[], filters: DrawFilters): Card[] {
  return allCards.filter((c) => {
    if (!filters.includeSpecial && c.special) return false
    if (filters.includeSpecial === false && c.special) return false
    if (!filters.allowedCategories.includes(c.category)) return false
    if (c.intensity > filters.maxIntensity) return false
    if (filters.kind && c.type !== filters.kind) return false
    return true
  })
}

/**
 * Tire une carte en évitant les répétitions : priorité aux cartes jamais
 * jouées, puis aux cartes non récemment refusées. Si la catégorie est
 * épuisée, le pioche est "remélangée" (les cartes déjà jouées redeviennent
 * disponibles) plutôt que de planter.
 */
export function drawCard(
  pool: Card[],
  played: Set<string>,
  tempExcluded: Set<string>,
  lastCategory: CategoryId | null,
): DrawResult {
  if (pool.length === 0) {
    return { card: null, deckWasReshuffled: false, categoryExhausted: true }
  }

  let candidates = pool.filter((c) => !played.has(c.id) && !tempExcluded.has(c.id))
  let reshuffled = false

  if (candidates.length === 0) {
    candidates = pool.filter((c) => !tempExcluded.has(c.id))
    reshuffled = true
  }

  if (candidates.length === 0) {
    candidates = pool
    reshuffled = true
  }

  const nonRepeatingCategory = candidates.filter((c) => c.category !== lastCategory)
  const finalCandidates = nonRepeatingCategory.length > 0 ? nonRepeatingCategory : candidates

  const card = pickRandom(finalCandidates) ?? null

  return {
    card,
    deckWasReshuffled: reshuffled,
    categoryExhausted: pool.every((c) => played.has(c.id)),
  }
}

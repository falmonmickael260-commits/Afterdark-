import type { Card, CardKind, CategoryId } from '../types/game'

interface BuildOptions {
  duration?: number
  consentIndexes?: number[]
}

export function buildCards(
  category: CategoryId,
  type: CardKind,
  intensity: Card['intensity'],
  texts: string[],
  opts: BuildOptions = {},
): Card[] {
  return texts.map((text, i) => ({
    id: `${category}-${type}-${intensity}-${i}`,
    type,
    category,
    intensity,
    text,
    duration: opts.duration,
    requiresConsent: opts.consentIndexes?.includes(i) || undefined,
  }))
}

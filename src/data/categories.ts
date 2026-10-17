import type { Category } from '../types/game'

export const CATEGORIES: Category[] = [
  {
    id: 'flirt',
    label: 'Flirt',
    emoji: '❤️',
    intensity: 1,
    shortDesc: 'Séduction légère, compliments, premières impressions.',
    color: '#ff6b9d',
    glow: 'rgba(255,107,157,0.45)',
  },
  {
    id: 'genant',
    label: 'Gênant',
    emoji: '😳',
    intensity: 2,
    shortDesc: "Petits secrets, bourdes et confidences qui font sourire.",
    color: '#ff9f6b',
    glow: 'rgba(255,159,107,0.45)',
  },
  {
    id: 'complices',
    label: 'Complices',
    emoji: '💛',
    intensity: 3,
    shortDesc: 'Confiance, humour partagé, vérités plus personnelles.',
    color: '#e0a73a',
    glow: 'rgba(224,167,58,0.45)',
  },
  {
    id: 'intense',
    label: 'Romance Intense',
    emoji: '💜',
    intensity: 4,
    shortDesc: 'Vulnérabilité, déclarations sincères, tension romantique.',
    color: '#9b5de5',
    glow: 'rgba(155,93,229,0.5)',
  },
  {
    id: 'confessions',
    label: 'Confessions',
    emoji: '🔥',
    intensity: 5,
    shortDesc: "Les vérités les plus profondes sur l'amour et le désir du cœur.",
    color: '#ff2e63',
    glow: 'rgba(255,46,99,0.55)',
  },
]

export const CATEGORY_MAP: Record<string, Category> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat
    return acc
  },
  {} as Record<string, Category>,
)

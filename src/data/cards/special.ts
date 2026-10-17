import type { Card, CategoryId } from '../../types/game'

interface SpecialSeed {
  special: Card['special']
  category: CategoryId
  intensity: Card['intensity']
  text: string
  duration?: number
}

const SEEDS: SpecialSeed[] = [
  // Carte Mystère — le contenu reste caché jusqu'à ce que le joueur l'accepte
  { special: 'mystere', category: 'flirt', intensity: 1, text: "Carte Mystère : ferme les yeux. Ton/ta partenaire va choisir en silence si ce sera une vérité ou une action — tu ne le sauras qu'après avoir accepté." },
  { special: 'mystere', category: 'genant', intensity: 2, text: "Carte Mystère : cette carte est tirée au hasard dans une catégorie inconnue. Accepte-la sans savoir ce qui t'attend." },
  { special: 'mystere', category: 'complices', intensity: 3, text: "Carte Mystère : tu ne verras le contenu qu'après avoir dit tout haut « j'accepte le mystère »." },
  { special: 'mystere', category: 'intense', intensity: 4, text: "Carte Mystère : une émotion forte t'attend. Prends une grande respiration avant de la révéler." },
  { special: 'mystere', category: 'confessions', intensity: 5, text: "Carte Mystère : cette carte a été choisie par le jeu pour ouvrir une vraie conversation. Es-tu prêt·e ?" },

  // Double Choix — deux options révélées, une seule jouée
  { special: 'double', category: 'flirt', intensity: 1, text: "Double Choix : deux cartes Flirt vont apparaître. Choisis celle que tu préfères jouer, l'autre est écartée." },
  { special: 'double', category: 'genant', intensity: 2, text: "Double Choix : deux cartes Gênant te sont proposées. Une seule sera jouée, à toi de décider." },
  { special: 'double', category: 'complices', intensity: 3, text: "Double Choix : deux cartes Complices s'affichent. Garde celle qui te parle le plus." },
  { special: 'double', category: 'intense', intensity: 4, text: "Double Choix : deux cartes Romance Intense apparaissent. Choisis celle qui te semble la plus vraie ce soir." },
  { special: 'double', category: 'confessions', intensity: 5, text: "Double Choix : deux Confessions te sont proposées. Une seule sera révélée à voix haute." },

  // Défi Chronométré
  { special: 'chrono', category: 'flirt', intensity: 1, text: "Défi Chronométré : tu as 20 secondes pour faire 3 compliments sans t'arrêter.", duration: 20 },
  { special: 'chrono', category: 'genant', intensity: 2, text: "Défi Chronométré : raconte ta bourde la plus gênante en 30 secondes, sans t'arrêter.", duration: 30 },
  { special: 'chrono', category: 'complices', intensity: 3, text: "Défi Chronométré : décris ce que tu ressens pour ton/ta partenaire pendant 30 secondes, sans t'arrêter.", duration: 30 },
  { special: 'chrono', category: 'intense', intensity: 4, text: "Défi Chronométré : fais une déclaration sincère en continu pendant 30 secondes.", duration: 30 },
  { special: 'chrono', category: 'confessions', intensity: 5, text: "Défi Chronométré : confie une vérité profonde sur votre relation en 45 secondes, sans t'arrêter.", duration: 45 },

  // Carte Inversée — le joueur actif pose la question
  { special: 'inversee', category: 'flirt', intensity: 1, text: "Carte Inversée : à toi de poser une question de flirt à ton/ta partenaire, de ton choix." },
  { special: 'inversee', category: 'genant', intensity: 2, text: "Carte Inversée : invente toi-même une question gênante à poser à l'autre." },
  { special: 'inversee', category: 'complices', intensity: 3, text: "Carte Inversée : pose une vraie question personnelle de ton choix à ton/ta partenaire." },
  { special: 'inversee', category: 'intense', intensity: 4, text: "Carte Inversée : formule toi-même une question profonde sur votre relation." },
  { special: 'inversee', category: 'confessions', intensity: 5, text: "Carte Inversée : pose la question la plus intime que tu as toujours voulu poser." },

  // Carte Joker
  { special: 'joker', category: 'flirt', intensity: 1, text: "Carte Joker : rejoue une carte déjà tirée ce soir, ou passe sans conséquence." },
  { special: 'joker', category: 'genant', intensity: 2, text: "Carte Joker : échange cette carte contre n'importe quelle catégorie de ton choix, une seule fois." },
  { special: 'joker', category: 'complices', intensity: 3, text: "Carte Joker : offre cette carte à ton/ta partenaire — c'est lui/elle qui répondra à sa place." },
  { special: 'joker', category: 'intense', intensity: 4, text: "Carte Joker : tu peux annuler cette carte sans justification, aucune pénalité." },
  { special: 'joker', category: 'confessions', intensity: 5, text: "Carte Joker : garde cette carte en réserve, tu pourras l'utiliser plus tard dans la partie." },

  // Carte Surprise — pioche mixte
  { special: 'surprise', category: 'flirt', intensity: 1, text: "Carte Surprise : le jeu va piocher dans une catégorie aléatoire parmi celles autorisées." },
  { special: 'surprise', category: 'genant', intensity: 2, text: "Carte Surprise : ferme les yeux, le hasard choisit pour vous deux." },
  { special: 'surprise', category: 'complices', intensity: 3, text: "Carte Surprise : les deux joueurs répondent en même temps à la question qui va suivre." },
  { special: 'surprise', category: 'intense', intensity: 4, text: "Carte Surprise : cette carte compte double pour la progression de la soirée." },
  { special: 'surprise', category: 'confessions', intensity: 5, text: "Carte Surprise : c'est la carte la plus rare de la soirée. Profitez-en pleinement." },
]

export const SPECIAL_CARDS: Card[] = SEEDS.map((seed, i) => ({
  id: `special-${seed.special}-${i}`,
  type: 'action',
  category: seed.category,
  intensity: seed.intensity,
  text: seed.text,
  special: seed.special,
  duration: seed.duration,
}))

# After Dark

Jeu Action ou Vérité pour deux, avec vérification de majorité, progression
d'intensité (Flirt → Gênant → Complices → Romance Intense → Confessions),
cartes spéciales, et deux façons de jouer :

- **En local** — les deux joueurs partagent le même téléphone (pass-and-play).
- **En ligne** — chacun sur son propre téléphone, synchronisé en temps réel
  via une room à 6 caractères : celui dont c'est le tour choisit Action ou
  Vérité, la carte part vers l'autre joueur, qui répond ou réalise l'action,
  et la réponse remonte à celui qui a posé la question.

## Lancer le projet en local

```bash
npm install
npm run dev
```

Le mode local fonctionne immédiatement, sans aucune configuration.

## Activer le mode en ligne (Supabase)

Le mode en ligne a besoin d'un projet Supabase gratuit pour synchroniser les
deux joueurs en temps réel.

1. Crée un compte sur [supabase.com](https://supabase.com) (gratuit, aucune
   carte bancaire nécessaire) et crée un nouveau projet.
2. Dans l'éditeur SQL du projet (onglet **SQL Editor**), colle et exécute le
   contenu de [`supabase/schema.sql`](supabase/schema.sql). Ça crée les
   tables `rooms` et `room_players`, active les policies d'accès et la
   réplication temps réel.
3. Dans **Project Settings → API**, récupère l'**URL du projet** et la clé
   **`anon` `public`**.
4. Copie `.env.example` vers `.env.local` et colle tes valeurs :

   ```bash
   cp .env.example .env.local
   ```

   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

5. Relance `npm run dev`. Le bouton « Jouer en ligne » de l'écran d'accueil
   fonctionne alors : un joueur crée une room (code à partager), l'autre le
   saisit pour rejoindre.

`.env.local` n'est jamais commité (déjà dans `.gitignore`).

### Sécurité du mode en ligne

Pour rester simple (pas de compte, pas de mot de passe), les tables Supabase
sont accessibles à quiconque connaît le code de room à 6 caractères. C'est un
compromis raisonnable pour un jeu occasionnel entre deux personnes, mais ce
n'est pas un système d'accès strict : ne stocke rien de sensible dans les
profils (prénom/surnom uniquement), et les rooms sont prévues pour être
éphémères.

## Déploiement

L'app est un site statique Vite standard (`npm run build` → dossier `dist/`)
et peut être déployée sur Vercel, Netlify, Railway ou tout hébergeur de sites
statiques. Si le mode en ligne est activé, pense à renseigner les variables
d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les
réglages de l'hébergeur (mêmes valeurs que `.env.local`).

## Stack

React, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Supabase (mode en
ligne uniquement).

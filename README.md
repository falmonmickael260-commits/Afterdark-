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

## Déploiement sur Railway

Le dépôt contient tout ce qu'il faut (`railway.json`, `server.js`) pour un
déploiement en un clic.

1. Sur [railway.app](https://railway.app), **New Project** → **Deploy from
   GitHub repo** → choisis ce dépôt (`Afterdark-`).
2. Railway détecte automatiquement `railway.json` : build avec
   `npm run build`, démarrage avec `npm run start`.
3. **Avant le premier déploiement** (ou avant de relancer un build), ouvre
   l'onglet **Variables** du service et ajoute :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   ⚠️ Important : ce sont des variables lues **au moment du build** (Vite les
   intègre dans le code à la compilation), pas au runtime. Si tu les ajoutes
   après un déploiement, il faut redéclencher un build (**Deploy** →
   **Redeploy**) pour qu'elles prennent effet.
4. Railway te donne une URL publique (`*.up.railway.app`) une fois le
   déploiement terminé — c'est le lien à partager pour jouer en ligne.

Le projet se déploie aussi tel quel sur Vercel ou Netlify (mêmes variables
d'environnement, pas besoin de `server.js` ni `railway.json` sur ces
plateformes qui servent les sites statiques nativement).

## Stack

React, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Supabase (mode en
ligne uniquement).

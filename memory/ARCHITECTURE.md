# Architecture NutriRun

## Stack
- React 18 + Vite
- JavaScript / JSX
- Styles : CSS inline uniquement (pas de Tailwind, pas de CSS modules)
- Icônes : lucide-react
- Graphiques : recharts (AreaChart)
- Auth + BDD : Supabase (@supabase/supabase-js)
- Hébergement : Vercel (auto-deploy depuis GitHub)

---

## Arborescence complète

```
nutrirun/
├── memory/                        ← ce dossier
├── public/
│   └── logo.svg                   ← logo SVG coureur (non utilisé, remplacé par Lucide)
├── src/
│   ├── main.jsx                   ← point d'entrée React + reset CSS inline
│   ├── App.jsx                    ← racine : auth flow + layout + routing onglets
│   ├── constants.js               ← tous les tokens (couleurs, config séances, repas)
│   ├── utils.js                   ← fonctions pures (calcBMR, fmtDef, dates...)
│   │
│   ├── lib/
│   │   └── supabase.js            ← client Supabase (URL + anon key)
│   │
│   ├── hooks/
│   │   ├── useAuth.js             ← session Supabase, signIn/signUp/signOut
│   │   ├── useProfil.js           ← profil utilisateur (load/save Supabase)
│   │   ├── useWeights.js          ← mesures poids (load/add/delete Supabase)
│   │   ├── useDay.js              ← données d'un jour (load/save Supabase)
│   │   ├── useWeek.js             ← données 7 jours pour TabSemaine
│   │   └── useStorage.js          ← (legacy localStorage — non utilisé en prod)
│   │
│   ├── components/
│   │   ├── Header.jsx             ← logo PersonStanding + badge BMR + bouton logout
│   │   ├── TabBar.jsx             ← 4 onglets (Jour/Semaine/Poids/Profil)
│   │   ├── LoginScreen.jsx        ← écran connexion/inscription email+password
│   │   │
│   │   ├── ui/
│   │   │   ├── Card.jsx           ← wrapper carte (border-radius, shadow)
│   │   │   ├── SectionLabel.jsx   ← label section (majuscules + icône)
│   │   │   └── StatCard.jsx       ← carte stat (icône + valeur + label)
│   │   │
│   │   ├── jour/
│   │   │   ├── SeanceSelector.jsx ← grille 5 boutons type séance
│   │   │   ├── MontreInput.jsx    ← input kcal dépensées montre
│   │   │   ├── RepasTable.jsx     ← tableau 5 repas (cible + réel)
│   │   │   └── SummaryCards.jsx   ← 3 cartes résumé (Cible/Consommé/Déficit)
│   │   │
│   │   ├── poids/
│   │   │   ├── WeightForm.jsx     ← input poids + date + bouton enregistrer
│   │   │   ├── WeightStats.jsx    ← 3 cartes (Dernier/Évolution/vs Objectif)
│   │   │   ├── WeightChart.jsx    ← AreaChart recharts + filtres 1m/3m/tout
│   │   │   └── WeightHistory.jsx  ← liste inversée + variation + suppression
│   │   │
│   │   ├── profil/
│   │   │   ├── ProfilForm.jsx     ← sexe (2 boutons) + âge/taille/poids
│   │   │   └── BMRCard.jsx        ← affichage BMR calculé + maintenance base
│   │   │
│   │   └── tabs/
│   │       ├── TabJour.jsx        ← navigation date + séance + repas + résumé
│   │       ├── TabSemaine.jsx     ← grille 7 jours + perte estimée
│   │       ├── TabPoids.jsx       ← form + stats + graphique + historique
│   │       └── TabProfil.jsx      ← form profil + BMRCard
│   │
├── index.html                     ← lang=fr, favicon logo.svg, meta PWA
├── package.json
└── vite.config.js
```

---

## Flux de données

```
App.jsx
  └── useAuth()           → user (Supabase session)
  └── useProfil(userId)   → profil (table profil)
  │
  ├── TabJour(profil, userId)
  │     └── useDay(userId, dayKey)   → data (table days)
  │
  ├── TabSemaine(profil, userId)
  │     └── useWeek(userId, offset)  → weekData (table days × 7)
  │
  ├── TabPoids(profil, userId)
  │     └── useWeights(userId)       → entries (table weights)
  │
  └── TabProfil(profil, onUpdate)
        → updateProfil() → table profil
```

---

## Règles de développement

1. **Mobile first** — max-width 430px centré
2. **Styles inline uniquement** — utiliser les tokens de `constants.js` (objet `C`)
3. **Pas de fetch ni API externe** — uniquement Supabase SDK
4. **Composants purs** — props descendantes, logique dans les hooks
5. **Optimistic updates** — état local mis à jour immédiatement, Supabase en async

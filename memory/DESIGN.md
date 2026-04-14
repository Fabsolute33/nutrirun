# Design tokens & conventions — NutriRun

## Palette (objet `C` dans `constants.js`)

| Token         | Valeur    | Usage                              |
|---------------|-----------|------------------------------------|
| `bg`          | #F1F5F9   | Fond de page                       |
| `surface`     | #FFFFFF   | Cartes, inputs                     |
| `border`      | #E2E8F0   | Bordures neutres                   |
| `text`        | #1E293B   | Texte principal                    |
| `muted`       | #64748B   | Texte secondaire, labels           |
| `faint`       | #94A3B8   | Texte très discret, icônes         |
| `accent`      | #16A34A   | Vert — déficit, positif, CTA       |
| `accentBg`    | #F0FDF4   | Fond vert clair                    |
| `accentBorder`| #BBF7D0   | Bordure verte claire               |
| `warn`        | #D97706   | Orange — attention, objectif poids |
| `warnBg`      | #FFFBEB   | Fond orange clair                  |
| `warnBorder`  | #FDE68A   | Bordure orange claire              |
| `danger`      | #DC2626   | Rouge — surplus calorique          |

---

## Convention déficit calorique

```
Déficit > 0  →  mangé MOINS que la maintenance  →  "-XXX kcal"  VERT  ✅
Déficit < 0  →  mangé PLUS que la maintenance   →  "+XXX kcal"  ROUGE ❌
Déficit = 0  →  équilibre                        →  "0"          GRIS
```

Fonctions dans `utils.js` :
- `fmtDef(v)` → formate la valeur avec le bon signe
- `getDefColor(v)` → retourne la couleur hex

---

## Types de séances (`SEANCE_CONFIG`)

| Clé          | Label         | Couleur   |
|--------------|---------------|-----------|
| `ef_matin`   | EF Matin      | #16A34A vert   |
| `ef_soir`    | EF Fin d'apm  | #059669 vert foncé |
| `fractionne` | Fractionné    | #D97706 orange |
| `longue`     | Longue sortie | #DC2626 rouge  |
| `repos`      | Repos         | #64748B gris   |

---

## Cibles caloriques par repas (`MEAL_TARGETS`)

| Séance       | Petit-déj | Collation mat. | Déjeuner | Collation 16h | Dîner | Total |
|--------------|-----------|----------------|----------|---------------|-------|-------|
| EF matin     | 450       | 150            | 600      | 200           | 700   | 2100  |
| EF fin d'apm | 450       | 200            | 650      | 300           | 500   | 2100  |
| Fractionné   | 550       | 200            | 650      | 350           | 550   | 2300  |
| Longue sortie| 600       | 200            | 700      | 250           | 650   | 2400  |
| Repos        | 350       | 150            | 550      | 150           | 600   | 1800  |

---

## Formule nutritionnelle

```
BMR (homme) = 10×poids + 6.25×taille − 5×age + 5
BMR (femme) = 10×poids + 6.25×taille − 5×age − 161

Maintenance = round(BMR × 1.375) + kcal_montre
Déficit     = Maintenance − Total_repas_consommés
```

---

## Icônes Lucide utilisées

Header / nav : `PersonStanding`, `LogOut`, `CalendarDays`, `BarChart2`, `Scale`, `User`
Séances : `Sunrise`, `Sunset`, `Zap`, `Activity`, `BedDouble`
Repas : `Coffee`, `Apple`, `ChefHat`, `Cookie`, `Moon`
Résumé : `Target`, `Utensils`, `TrendingDown`, `TrendingUp`, `Info`
Auth : `Mail`, `Lock`, `LogIn`, `UserPlus`, `AlertCircle`, `CheckCircle2`
Poids : `Scale`, `Trash2`, `Plus`, `Watch`

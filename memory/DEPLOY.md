# Déploiement — NutriRun

## GitHub
- **Repo** : https://github.com/Fabsolute33/nutrirun
- **Compte** : Fabsolute33
- **Branche principale** : master
- **Push** : `git push` depuis `nutrirun/`

## Vercel
- **Auto-deploy** : chaque `git push` sur master → redéploiement automatique
- **Build command** : `npm run build`
- **Output dir** : `dist`
- **Framework** : Vite (détecté automatiquement)

## Workflow quotidien

```bash
# Modifier du code, puis :
cd nutrirun
git add .
git commit -m "description du changement"
git push
# → Vercel redéploie automatiquement en ~1 min
```

## Variables d'environnement
Aucune — la clé Supabase anon est directement dans `src/lib/supabase.js`
(la clé anon est publique par conception, sécurité assurée par RLS).

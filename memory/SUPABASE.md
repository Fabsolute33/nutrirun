# Supabase — NutriRun

## Projet
- **URL** : https://ranklzwincjnvtabqfmj.supabase.co
- **Project ID** : ranklzwincjnvtabqfmj
- **Anon key** : dans `src/lib/supabase.js`
- **Auth** : email + password (Supabase Auth)

---

## Schéma des tables

### `public.profil`
```sql
create table public.profil (
  id         uuid references auth.users on delete cascade primary key,
  poids      numeric,
  taille     numeric,
  age        numeric,
  sexe       text default 'm',
  updated_at timestamptz default now()
);
```
- PK = `id` (= auth.users.id)
- 1 ligne par utilisateur
- upsert par `id` (PK) → pas de onConflict nécessaire

### `public.weights`
```sql
create table public.weights (
  user_id uuid references auth.users on delete cascade not null,
  date    date not null,
  value   numeric not null,
  primary key (user_id, date)
);
```
- PK composite `(user_id, date)` → upsert natif sans onConflict
- Une seule mesure par jour par utilisateur

### `public.days`
```sql
create table public.days (
  user_id        uuid references auth.users on delete cascade not null,
  date           date not null,
  seance_type    text,
  kcal_depensees numeric default 0,
  repas          jsonb default '["","","","",""]'::jsonb,
  primary key (user_id, date)
);
```
- PK composite `(user_id, date)` → upsert natif sans onConflict
- `repas` : tableau JSON de 5 valeurs string ["450","200","600","",""]
- `seance_type` : ef_matin | ef_soir | fractionne | longue | repos | null

---

## Row Level Security (RLS)

Toutes les tables ont RLS activé. Chaque utilisateur ne voit que ses propres données :

```sql
-- profil
create policy "own profil" on public.profil
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- weights
create policy "own weights" on public.weights
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- days
create policy "own days" on public.days
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

---

## SQL complet à réexécuter si besoin

```sql
-- profil (PK simple)
drop table if exists public.profil;
create table public.profil (
  id uuid references auth.users on delete cascade primary key,
  poids numeric, taille numeric, age numeric,
  sexe text default 'm', updated_at timestamptz default now()
);
alter table public.profil enable row level security;
create policy "own profil" on public.profil
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- weights (PK composite)
drop table if exists public.weights;
create table public.weights (
  user_id uuid references auth.users on delete cascade not null,
  date date not null, value numeric not null,
  primary key (user_id, date)
);
alter table public.weights enable row level security;
create policy "own weights" on public.weights
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- days (PK composite)
drop table if exists public.days;
create table public.days (
  user_id uuid references auth.users on delete cascade not null,
  date date not null, seance_type text,
  kcal_depensees numeric default 0,
  repas jsonb default '["","","","",""]'::jsonb,
  primary key (user_id, date)
);
alter table public.days enable row level security;
create policy "own days" on public.days
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

---

## Piège connu — upsert 409 Conflict
Si les tables ont un `id uuid primary key` séparé + `unique(user_id, date)`,
le upsert Supabase crée un nouveau `id` à chaque appel → 409 Conflict.
**Solution** : PK composite `(user_id, date)` directement (voir schéma ci-dessus).

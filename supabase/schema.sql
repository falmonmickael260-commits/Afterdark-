-- AFTER DARK — schéma Supabase pour le mode en ligne (rooms à 2 joueurs)
-- À exécuter une fois dans l'éditeur SQL de ton projet Supabase.

create table if not exists rooms (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'lobby',        -- lobby | playing | ended
  settings jsonb not null default '{}'::jsonb,  -- { allowedCategories, maxIntensity, specialCardsEnabled, drawMode }
  asker_slot int not null default 0,            -- 0 | 1 — qui choisit Action/Vérité ce tour-ci
  turn_number int not null default 1,
  turns_played int[] not null default '{0,0}',
  jokers_used int[] not null default '{0,0}',
  played_ids text[] not null default '{}',
  excluded_ids text[] not null default '{}',
  last_category text,
  turn_status text not null default 'idle',     -- idle | awaiting_response | resolved
  card jsonb,
  response jsonb,
  history jsonb not null default '[]'::jsonb
);

create table if not exists room_players (
  room_id text not null references rooms(id) on delete cascade,
  slot int not null check (slot in (0, 1)),
  name text not null default '',
  gender text not null default 'autre',
  attraction text not null default 'non precise',
  ready boolean not null default false,
  last_seen timestamptz not null default now(),
  primary key (room_id, slot)
);

alter table rooms enable row level security;
alter table room_players enable row level security;

-- Jeu occasionnel entre deux personnes qui partagent un code de room à 6
-- caractères : on autorise la lecture/écriture publique scopée par le code,
-- sans compte ni mot de passe. Ne stocke rien de sensible dans ces tables.
drop policy if exists "rooms anon access" on rooms;
create policy "rooms anon access" on rooms for all using (true) with check (true);

drop policy if exists "room_players anon access" on room_players;
create policy "room_players anon access" on room_players for all using (true) with check (true);

-- Realtime : active la réplication sur ces deux tables (Database > Replication
-- dans le dashboard Supabase, ou via la commande ci-dessous).
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table room_players;

-- Nettoyage optionnel des vieilles rooms (à exécuter manuellement ou via un cron Supabase).
-- delete from rooms where updated_at < now() - interval '24 hours';

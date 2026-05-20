-- ===========================================
-- Market Radar - Supabase Setup
-- Exécuter ce SQL dans : Supabase Dashboard > SQL Editor
-- ===========================================

-- 1. Table des rapports
create table reports (
  id text primary key,
  title text not null,
  description text not null,
  category text not null,
  upload_date timestamptz not null default now(),
  file_url text,
  ai_summary text
);

-- 2. Table des catégories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- 3. Activer Row Level Security (requis par Supabase)
alter table reports enable row level security;
alter table categories enable row level security;

-- 4. Policies : lecture publique, écriture publique (anon)
-- (Pour un vrai projet, restreindre l'écriture aux utilisateurs authentifiés)
create policy "Public read reports" on reports for select using (true);
create policy "Public insert reports" on reports for insert with check (true);
create policy "Public update reports" on reports for update using (true);
create policy "Public delete reports" on reports for delete using (true);

create policy "Public read categories" on categories for select using (true);
create policy "Public insert categories" on categories for insert with check (true);
create policy "Public delete categories" on categories for delete using (true);

-- 5. Créer le bucket Storage pour les PDFs
insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', true);

-- 6. Policy Storage : upload et lecture publique
create policy "Public upload pdfs" on storage.objects for insert with check (bucket_id = 'pdfs');
create policy "Public read pdfs" on storage.objects for select using (bucket_id = 'pdfs');
create policy "Public delete pdfs" on storage.objects for delete using (bucket_id = 'pdfs');

-- ===========================================
-- 7. Newsletter : table des abonnés
-- ===========================================
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  unsubscribe_token text not null default replace(gen_random_uuid()::text, '-', ''),
  consent_given boolean not null default true,
  consent_at timestamptz not null default now()
);

create index subscribers_unsubscribe_token_idx on subscribers(unsubscribe_token);

alter table subscribers enable row level security;

-- Lecture/suppression réservée aux utilisateurs authentifiés (admin)
-- L'inscription publique passe par une Edge Function (service_role), donc pas de policy "insert public" ici
create policy "Auth read subscribers" on subscribers
  for select using (auth.role() = 'authenticated');

create policy "Auth delete subscribers" on subscribers
  for delete using (auth.role() = 'authenticated');

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

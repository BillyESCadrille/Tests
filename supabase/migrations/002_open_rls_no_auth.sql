-- ─────────────────────────────────────────────────────────────────────────────
-- SlideBase — patch RLS pour mode sans authentification
-- À exécuter dans le SQL Editor Supabase après 001_init.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Supprimer les anciennes policies qui exigent auth.role() = 'authenticated'
drop policy if exists "presentations: read authenticated" on public.presentations;
drop policy if exists "presentations: insert own"         on public.presentations;
drop policy if exists "presentations: update own"         on public.presentations;
drop policy if exists "presentations: delete own"         on public.presentations;

drop policy if exists "slides: read authenticated"        on public.slides;
drop policy if exists "slides: write own"                 on public.slides;

drop policy if exists "tags: read all"                    on public.tags;
drop policy if exists "tags: insert authenticated"        on public.tags;

drop policy if exists "presentation_tags: read"           on public.presentation_tags;
drop policy if exists "presentation_tags: write own"      on public.presentation_tags;

drop policy if exists "slide_tags: read"                  on public.slide_tags;

-- Créer un utilisateur anonyme de substitution (pour uploaded_by)
insert into public.users (id, email, name, role)
values (
  '00000000-0000-0000-0000-000000000000',
  'anon@partoo.co',
  'Anonyme',
  'user'
) on conflict (id) do nothing;

-- Nouvelles policies ouvertes (tout le monde peut lire et écrire)
-- ⚠️  À resserrer quand l'auth Google sera activée
create policy "presentations: open read"   on public.presentations for select using (true);
create policy "presentations: open insert" on public.presentations for insert with check (true);
create policy "presentations: open update" on public.presentations for update using (true);
create policy "presentations: open delete" on public.presentations for delete using (true);

create policy "slides: open read"          on public.slides for select using (true);
create policy "slides: open write"         on public.slides for all using (true);

create policy "tags: open read"            on public.tags for select using (true);
create policy "tags: open insert"          on public.tags for insert with check (true);

create policy "presentation_tags: open read"  on public.presentation_tags for select using (true);
create policy "presentation_tags: open write" on public.presentation_tags for all using (true);

create policy "slide_tags: open read"         on public.slide_tags for select using (true);
create policy "slide_tags: open write"        on public.slide_tags for all using (true);

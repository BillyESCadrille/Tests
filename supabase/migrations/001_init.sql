-- ─────────────────────────────────────────────────────────────────────────────
-- SlideBase — initial schema
-- Run this in the Supabase SQL editor or via `supabase db push`
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension (already enabled on Supabase by default)
create extension if not exists "uuid-ossp";

-- ─── users ───────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  name        text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create a user row on first sign-in via a trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── tags ────────────────────────────────────────────────────────────────────
create table if not exists public.tags (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null unique,
  category    text,
  created_by  uuid references public.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Seed popular tags
insert into public.tags (label, category) values
  ('product',       'Type'),
  ('sales',         'Type'),
  ('onboarding',    'Type'),
  ('demo',          'Type'),
  ('roadmap',       'Type'),
  ('investisseurs', 'Type'),
  ('pitch-deck',    'Type'),
  ('smb',           'Segment'),
  ('enterprise',    'Segment'),
  ('fr',            'Langue'),
  ('en',            'Langue'),
  ('es',            'Langue')
on conflict (label) do nothing;

-- ─── presentations ───────────────────────────────────────────────────────────
create table if not exists public.presentations (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  uploaded_by   uuid not null references public.users(id) on delete cascade,
  team          text,
  language      text,
  file_url      text not null,
  thumbnail_url text,
  slide_count   integer not null default 0,
  views         integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists presentations_updated_at on public.presentations;
create trigger presentations_updated_at
  before update on public.presentations
  for each row execute procedure public.set_updated_at();

-- ─── slides ──────────────────────────────────────────────────────────────────
create table if not exists public.slides (
  id                uuid primary key default uuid_generate_v4(),
  presentation_id   uuid not null references public.presentations(id) on delete cascade,
  slide_index       integer not null,
  thumbnail_url     text,
  created_at        timestamptz not null default now(),
  unique (presentation_id, slide_index)
);

-- ─── join tables ─────────────────────────────────────────────────────────────
create table if not exists public.presentation_tags (
  presentation_id uuid not null references public.presentations(id) on delete cascade,
  tag_id          uuid not null references public.tags(id) on delete cascade,
  primary key (presentation_id, tag_id)
);

create table if not exists public.slide_tags (
  slide_id  uuid not null references public.slides(id) on delete cascade,
  tag_id    uuid not null references public.tags(id) on delete cascade,
  primary key (slide_id, tag_id)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.users            enable row level security;
alter table public.presentations    enable row level security;
alter table public.slides           enable row level security;
alter table public.tags             enable row level security;
alter table public.presentation_tags enable row level security;
alter table public.slide_tags       enable row level security;

-- users: read own profile; auto-insert via trigger
create policy "users: read own" on public.users
  for select using (auth.uid() = id);

-- presentations: all authenticated @partoo.co users can read
create policy "presentations: read authenticated" on public.presentations
  for select using (auth.role() = 'authenticated');

create policy "presentations: insert own" on public.presentations
  for insert with check (auth.uid() = uploaded_by);

create policy "presentations: update own" on public.presentations
  for update using (auth.uid() = uploaded_by);

create policy "presentations: delete own" on public.presentations
  for delete using (auth.uid() = uploaded_by);

-- slides: same as presentations (read all authenticated, write own)
create policy "slides: read authenticated" on public.slides
  for select using (auth.role() = 'authenticated');

create policy "slides: write own" on public.slides
  for all using (
    auth.uid() = (select uploaded_by from public.presentations where id = presentation_id)
  );

-- tags: everyone can read; authenticated can create
create policy "tags: read all" on public.tags
  for select using (true);

create policy "tags: insert authenticated" on public.tags
  for insert with check (auth.role() = 'authenticated');

-- presentation_tags / slide_tags: read all authenticated; write own
create policy "presentation_tags: read" on public.presentation_tags
  for select using (auth.role() = 'authenticated');

create policy "presentation_tags: write own" on public.presentation_tags
  for all using (
    auth.uid() = (select uploaded_by from public.presentations where id = presentation_id)
  );

create policy "slide_tags: read" on public.slide_tags
  for select using (auth.role() = 'authenticated');

-- ─── Storage bucket ──────────────────────────────────────────────────────────
-- Create this in the Supabase Storage dashboard or via CLI:
-- supabase storage create presentations --public
-- Alternatively uncomment the lines below if using supabase CLI migrations:
-- insert into storage.buckets (id, name, public) values ('presentations', 'presentations', true)
-- on conflict do nothing;

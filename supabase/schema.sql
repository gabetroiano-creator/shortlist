-- Shortlist — run this once in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Creates per-user list storage with row-level security so each user can only ever
-- read or write their own row.

create table if not exists public.lists (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.lists enable row level security;

drop policy if exists "own list - select" on public.lists;
drop policy if exists "own list - insert" on public.lists;
drop policy if exists "own list - update" on public.lists;

create policy "own list - select" on public.lists
  for select using (auth.uid() = user_id);

create policy "own list - insert" on public.lists
  for insert with check (auth.uid() = user_id);

create policy "own list - update" on public.lists
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

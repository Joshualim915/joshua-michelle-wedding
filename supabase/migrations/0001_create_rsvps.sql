-- Wedding RSVP table for Joshua & Michelle
-- Run this in the Supabase Dashboard → SQL Editor.
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attending text not null check (attending in ('yes', 'no')),
  guests integer,
  appetizer text,
  main text,
  carbs text,
  dessert text,
  dietary text,
  song text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security.
alter table public.rsvps enable row level security;

-- Anyone (even anonymous) may insert a new RSVP.
drop policy if exists "anyone can insert rsvps" on public.rsvps;
create policy "anyone can insert rsvps"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);

-- Only authenticated readers (you, via the service role or dashboard) may read.
-- Anonymous visitors cannot read other people's RSVPs.
drop policy if exists "no anon reads" on public.rsvps;
create policy "no anon reads"
  on public.rsvps for select
  to anon
  using (false);

-- Authenticated users (e.g. you as the project owner) may read all rows.
drop policy if exists "authenticated can read rsvps" on public.rsvps;
create policy "authenticated can read rsvps"
  on public.rsvps for select
  to authenticated
  using (true);

-- Helpful index for sorting by submission time.
create index if not exists rsvps_created_at_idx
  on public.rsvps (created_at desc);
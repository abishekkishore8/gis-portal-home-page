create extension if not exists pgcrypto;

create table if not exists public.villages (
  id text primary key,
  name text not null,
  district text not null,
  state text not null,
  lat double precision not null,
  lng double precision not null,
  population integer not null default 0,
  households integer not null default 0,
  overall_score double precision not null check (overall_score between 0 and 10),
  images jsonb not null default '[]'::jsonb,
  scores jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists villages_set_updated_at on public.villages;

create trigger villages_set_updated_at
before update on public.villages
for each row
execute function public.set_updated_at();

alter table public.villages enable row level security;

drop policy if exists "villages are readable" on public.villages;
create policy "villages are readable"
on public.villages
for select
to anon, authenticated
using (true);

drop policy if exists "villages are writable by service role" on public.villages;
create policy "villages are writable by service role"
on public.villages
for all
to service_role
using (true)
with check (true);

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists site_content_set_updated_at on public.site_content;

create trigger site_content_set_updated_at
before update on public.site_content
for each row
execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "site content is readable" on public.site_content;
create policy "site content is readable"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "site content is writable by service role" on public.site_content;
create policy "site content is writable by service role"
on public.site_content
for all
to service_role
using (true)
with check (true);
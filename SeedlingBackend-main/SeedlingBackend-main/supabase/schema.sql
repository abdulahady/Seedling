-- Seedling Supabase schema for ContentBlock migration.
-- Run in Supabase SQL editor (or psql connected to Supabase Postgres).

create extension if not exists pgcrypto;

create table if not exists public.content_pages (
  id bigint primary key,
  title text not null,
  tag text not null,
  author text,
  published_date date,
  legacy_type text default 'core.ContentBlock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id bigint not null references public.content_pages(id) on delete cascade,
  block_order integer not null,
  block_type text not null,
  block_value jsonb not null,
  created_at timestamptz not null default now(),
  unique (page_id, block_order)
);

create table if not exists public.media_assets (
  id bigint primary key,
  asset_type text not null check (asset_type in ('image', 'document')),
  title text,
  bucket_name text not null,
  object_path text not null,
  mime_type text,
  created_at timestamptz not null default now()
);

create index if not exists idx_content_pages_tag on public.content_pages(tag);
create index if not exists idx_page_blocks_page_id on public.page_blocks(page_id);
create index if not exists idx_page_blocks_type on public.page_blocks(block_type);
create index if not exists idx_media_assets_type on public.media_assets(asset_type);

-- Keep updated_at in sync.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_content_pages_updated_at on public.content_pages;
create trigger trg_content_pages_updated_at
before update on public.content_pages
for each row execute function public.set_updated_at();

-- Enable RLS.
alter table public.content_pages enable row level security;
alter table public.page_blocks enable row level security;
alter table public.media_assets enable row level security;

-- Public read-only policies (frontend fetches content anonymously).
drop policy if exists "public_can_read_content_pages" on public.content_pages;
create policy "public_can_read_content_pages"
on public.content_pages
for select
to anon, authenticated
using (true);

drop policy if exists "public_can_read_page_blocks" on public.page_blocks;
create policy "public_can_read_page_blocks"
on public.page_blocks
for select
to anon, authenticated
using (true);

drop policy if exists "public_can_read_media_assets" on public.media_assets;
create policy "public_can_read_media_assets"
on public.media_assets
for select
to anon, authenticated
using (true);

-- Restrict writes to service role only (performed by migration jobs/edge functions).
drop policy if exists "service_role_manage_content_pages" on public.content_pages;
create policy "service_role_manage_content_pages"
on public.content_pages
for all
to service_role
using (true)
with check (true);

drop policy if exists "service_role_manage_page_blocks" on public.page_blocks;
create policy "service_role_manage_page_blocks"
on public.page_blocks
for all
to service_role
using (true)
with check (true);

drop policy if exists "service_role_manage_media_assets" on public.media_assets;
create policy "service_role_manage_media_assets"
on public.media_assets
for all
to service_role
using (true)
with check (true);

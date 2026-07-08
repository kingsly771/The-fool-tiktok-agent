-- FOOL: AI TikTok Growth Analyst — Database Schema
-- Run in Supabase SQL editor

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text unique not null,
  email text,
  display_name text,
  plan text not null default 'free' check (plan in ('free','pro','agency')),
  created_at timestamptz not null default now()
);

create table if not exists analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  tiktok_username text not null,
  tiktok_url text,
  growth_score int not null check (growth_score between 0 and 100),
  branding_score int not null check (branding_score between 0 and 100),
  content_quality_score int not null check (content_quality_score between 0 and 100),
  consistency_score int not null check (consistency_score between 0 and 100),
  seo_score int not null check (seo_score between 0 and 100),
  retention_score int not null check (retention_score between 0 and 100),
  viral_potential_score int not null check (viral_potential_score between 0 and 100),
  bio_review text,
  strengths jsonb not null default '[]',
  weaknesses jsonb not null default '[]',
  opportunities jsonb not null default '[]',
  threats jsonb not null default '[]',
  recommendations jsonb not null default '[]',
  raw_ai_response jsonb,
  created_at timestamptz not null default now()
);

create table if not exists content_ideas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  analysis_id uuid references analyses(id) on delete set null,
  niche text not null,
  ideas jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists growth_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  analysis_id uuid references analyses(id) on delete set null,
  plan jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  analysis_id uuid references analyses(id) on delete cascade,
  executive_summary text,
  swot jsonb,
  action_plan jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analyses_user on analyses(user_id);
create index if not exists idx_ideas_user on content_ideas(user_id);
create index if not exists idx_reports_user on reports(user_id);

alter table profiles enable row level security;
alter table analyses enable row level security;
alter table content_ideas enable row level security;
alter table growth_plans enable row level security;
alter table reports enable row level security;

-- RLS: service role (used by server routes with Clerk-verified user) bypasses RLS.
-- These policies allow anon/authenticated reads scoped by clerk_user_id via profiles join if you
-- later expose direct client reads. By default all writes go through server routes using the
-- service role key, which is the recommended pattern with Clerk + Supabase.

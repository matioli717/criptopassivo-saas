-- Migration: user_profiles para controle de plano (free/pro)
-- Rode no SQL Editor do Supabase

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro')),
  cakto_customer_id text,
  cakto_subscription_id text,
  subscription_status text default 'inactive' check (subscription_status in ('active','cancelled','past_due','inactive')),
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table user_profiles enable row level security;

create policy "Users view own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on user_profiles for update
  using (auth.uid() = id);

create index if not exists idx_user_profiles_cakto_customer on user_profiles(cakto_customer_id);
create index if not exists idx_user_profiles_cakto_sub on user_profiles(cakto_subscription_id);
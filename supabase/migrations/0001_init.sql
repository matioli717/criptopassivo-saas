-- CriptoPassivo Dashboard — schema inicial
-- Rode isso no SQL Editor do seu projeto Supabase, ou via `supabase db push`
-- se você tiver o Supabase CLI configurado no Codespaces.

create extension if not exists "pgcrypto";

-- ============ PORTFOLIO ASSETS ============

create table if not exists portfolio_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  coingecko_id text not null default 'tether', -- ex: 'ethereum', 'solana', 'tether' (stablecoin ~ USD)
  category text not null default 'Core' check (category in ('Core','Estável','Satélite','Reserva')),
  target_pct numeric not null default 0,
  quantity numeric not null default 0,
  apy numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table portfolio_assets enable row level security;

create policy "Usuários veem só os próprios ativos"
  on portfolio_assets for select
  using (auth.uid() = user_id);

create policy "Usuários inserem só os próprios ativos"
  on portfolio_assets for insert
  with check (auth.uid() = user_id);

create policy "Usuários atualizam só os próprios ativos"
  on portfolio_assets for update
  using (auth.uid() = user_id);

create policy "Usuários deletam só os próprios ativos"
  on portfolio_assets for delete
  using (auth.uid() = user_id);

-- ============ SALES (para cálculo de IR) ============

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_name text not null,
  sale_date date,
  sale_value numeric not null default 0,
  cost_value numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table sales enable row level security;

create policy "Usuários veem só as próprias vendas"
  on sales for select
  using (auth.uid() = user_id);

create policy "Usuários inserem só as próprias vendas"
  on sales for insert
  with check (auth.uid() = user_id);

create policy "Usuários deletam só as próprias vendas"
  on sales for delete
  using (auth.uid() = user_id);

-- ============ INDEXES ============

create index if not exists idx_portfolio_assets_user on portfolio_assets(user_id);
create index if not exists idx_sales_user on sales(user_id);

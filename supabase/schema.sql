-- ============================================================
-- FinançasPessoais — Schema Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- ============================================================

-- Habilitar UUID
create extension if not exists "pgcrypto";

-- ============================================================
-- TABELA: categories
-- ============================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  name        text not null,
  color       text not null default '#94a3b8',
  icon        text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Categorias padrão (compartilhadas, user_id = null)
insert into public.categories (name, color, is_default) values
  ('Alimentação',   '#f59e0b', true),
  ('Transporte',    '#3b82f6', true),
  ('Moradia',       '#8b5cf6', true),
  ('Saúde',         '#22c55e', true),
  ('Educação',      '#06b6d4', true),
  ('Lazer',         '#ec4899', true),
  ('Vestuário',     '#f97316', true),
  ('Salário',       '#22c55e', true),
  ('Investimentos', '#14b8a6', true),
  ('Outros',        '#94a3b8', true)
on conflict do nothing;

-- ============================================================
-- TABELA: transactions
-- ============================================================
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('income', 'expense')),
  amount      numeric(12, 2) not null check (amount > 0),
  description text not null,
  category_id uuid references public.categories(id) on delete set null,
  date        date not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- categories
alter table public.categories enable row level security;

create policy "Categorias padrão visíveis a todos"
  on public.categories for select
  using (is_default = true or auth.uid() = user_id);

create policy "Usuário gerencia suas categorias"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- transactions
alter table public.transactions enable row level security;

create policy "Usuário vê suas transações"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Usuário cria suas transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza suas transações"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuário deleta suas transações"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
create index if not exists idx_transactions_user_id   on public.transactions(user_id);
create index if not exists idx_transactions_date       on public.transactions(date desc);
create index if not exists idx_transactions_type       on public.transactions(type);
create index if not exists idx_transactions_category   on public.transactions(category_id);
create index if not exists idx_categories_user_id      on public.categories(user_id);

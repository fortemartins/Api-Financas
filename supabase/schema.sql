-- =====================================================
-- FinançasPessoais — Schema SQL para Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- =====================================================

-- 1. Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#94a3b8',
  icon        TEXT,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id  ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date      ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type      ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category  ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id     ON categories(user_id);

-- 4. Row Level Security
ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies: categories
CREATE POLICY "Usuários veem próprias categorias e as padrão"
  ON categories FOR SELECT
  USING (auth.uid() = user_id OR is_default = TRUE);

CREATE POLICY "Usuários criam próprias categorias"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários atualizam próprias categorias"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários excluem próprias categorias"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- Policies: transactions
CREATE POLICY "Usuários veem próprias transações"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários criam próprias transações"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários atualizam próprias transações"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários excluem próprias transações"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Categorias padrão (inseridas sem user_id)
INSERT INTO categories (name, color, is_default) VALUES
  ('Alimentação',    '#f97316', TRUE),
  ('Transporte',     '#3b82f6', TRUE),
  ('Moradia',        '#8b5cf6', TRUE),
  ('Saúde',          '#22c55e', TRUE),
  ('Educação',       '#06b6d4', TRUE),
  ('Lazer',          '#ec4899', TRUE),
  ('Salário',        '#22c55e', TRUE),
  ('Investimentos',  '#f59e0b', TRUE),
  ('Outros',         '#94a3b8', TRUE)
ON CONFLICT DO NOTHING;

-- 6. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

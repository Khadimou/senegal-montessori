-- =============================================
-- SCHEMA FINANCES POUR MONTESSORI SÉNÉGAL
-- =============================================
-- Exécute ce script dans l'éditeur SQL de Supabase
-- Dashboard > SQL Editor > New Query > Paste > Run

-- 1. Ajouter les colonnes financières à la table products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cost_price INTEGER DEFAULT 0,           -- Prix d'achat/coût de fabrication
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,       -- Quantité en stock
ADD COLUMN IF NOT EXISTS min_stock_alert INTEGER DEFAULT 5,      -- Seuil d'alerte stock bas
ADD COLUMN IF NOT EXISTS supplier VARCHAR(255),                  -- Fournisseur
ADD COLUMN IF NOT EXISTS total_sold INTEGER DEFAULT 0;           -- Total vendu (calculé)

-- 2. Table des dépenses/achats de stock
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,                                -- 'stock', 'marketing', 'transport', 'autres'
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,                                       -- Montant en FCFA
  quantity INTEGER DEFAULT 0,                                    -- Quantité achetée (si stock)
  supplier VARCHAR(255),
  receipt_url TEXT,                                              -- URL du reçu/facture
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table pour les objectifs financiers
CREATE TABLE IF NOT EXISTS financial_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  target_amount INTEGER NOT NULL,                                -- Objectif en FCFA
  current_amount INTEGER DEFAULT 0,                              -- Montant actuel
  goal_type VARCHAR(50) NOT NULL,                                -- 'revenue', 'profit', 'savings'
  period VARCHAR(50) NOT NULL,                                   -- 'monthly', 'quarterly', 'yearly'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_product ON expenses(product_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_financial_goals_active ON financial_goals(is_active);

-- 5. Triggers pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_goals_updated_at ON financial_goals;
CREATE TRIGGER update_financial_goals_updated_at
  BEFORE UPDATE ON financial_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Policies RLS pour expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dépenses visibles par tous" ON expenses;
CREATE POLICY "Dépenses visibles par tous" ON expenses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Dépenses modifiables" ON expenses;
CREATE POLICY "Dépenses modifiables" ON expenses
  FOR ALL USING (true);

-- 7. Policies RLS pour financial_goals
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Objectifs visibles par tous" ON financial_goals;
CREATE POLICY "Objectifs visibles par tous" ON financial_goals
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Objectifs modifiables" ON financial_goals;
CREATE POLICY "Objectifs modifiables" ON financial_goals
  FOR ALL USING (true);

-- 8. Vérification
SELECT 'Schema finances créé avec succès!' as message;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('cost_price', 'stock_quantity', 'min_stock_alert', 'supplier', 'total_sold');


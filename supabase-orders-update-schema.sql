-- ============================================
-- MISE À JOUR TABLE ORDERS - CODES PROMO
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ============================================

-- Ajouter les colonnes pour les codes promo et calculs
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal INTEGER,
ADD COLUMN IF NOT EXISTS discount_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS promo_code_id UUID REFERENCES promo_codes(id),
ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50);

-- Mettre à jour les commandes existantes avec les valeurs par défaut
UPDATE orders 
SET 
  subtotal = COALESCE(subtotal, total),
  discount_amount = COALESCE(discount_amount, 0)
WHERE subtotal IS NULL OR discount_amount IS NULL;

-- Vérification
SELECT 
  id, 
  customer_name, 
  subtotal, 
  discount_amount, 
  total, 
  promo_code,
  created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;



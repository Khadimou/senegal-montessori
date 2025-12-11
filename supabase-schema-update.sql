-- =============================================
-- MISE À JOUR SCHEMA POUR NABOOPAY
-- =============================================
-- Exécute ce script après le schema principal
-- Dashboard > SQL Editor > New Query

-- Ajouter les colonnes pour NabooPay à la table orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS naboopay_transaction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

-- Index pour rechercher par transaction NabooPay
CREATE INDEX IF NOT EXISTS idx_orders_naboopay_transaction 
ON orders(naboopay_transaction_id);

-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders';


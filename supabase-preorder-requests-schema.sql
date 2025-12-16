-- ============================================
-- SCHÉMA POUR LES DEMANDES DE PRÉCOMMANDE
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ============================================

-- Table des demandes de précommande (liste d'attente)
CREATE TABLE IF NOT EXISTS preorder_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  quantity_requested INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_preorder_requests_product_id ON preorder_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_preorder_requests_status ON preorder_requests(status);
CREATE INDEX IF NOT EXISTS idx_preorder_requests_email ON preorder_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_preorder_requests_created_at ON preorder_requests(created_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_preorder_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_preorder_requests_updated_at ON preorder_requests;
CREATE TRIGGER trigger_preorder_requests_updated_at
  BEFORE UPDATE ON preorder_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_preorder_requests_updated_at();

-- Politique RLS
ALTER TABLE preorder_requests ENABLE ROW LEVEL SECURITY;

-- Permettre à tout le monde de créer une demande
CREATE POLICY "Allow public to insert preorder requests"
  ON preorder_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Lecture/mise à jour admin seulement (via service role)
CREATE POLICY "Allow service role to read preorder requests"
  ON preorder_requests FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to update preorder requests"
  ON preorder_requests FOR UPDATE
  TO service_role
  USING (true);

-- ============================================
-- Vue pour résumer les demandes par produit
-- ============================================
CREATE OR REPLACE VIEW preorder_summary AS
SELECT 
  product_id,
  product_name,
  COUNT(*) as total_requests,
  SUM(quantity_requested) as total_quantity_requested,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
  COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_requests,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_requests
FROM preorder_requests
GROUP BY product_id, product_name
ORDER BY total_quantity_requested DESC;

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Exécutez cette requête pour vérifier la création :
-- SELECT * FROM preorder_requests LIMIT 1;
-- SELECT * FROM preorder_summary;


-- =============================================
-- SCHEMA CODES PROMO POUR MONTESSORI SÉNÉGAL
-- =============================================
-- Exécute ce script dans l'éditeur SQL de Supabase
-- Dashboard > SQL Editor > New Query > Paste > Run

-- 1. Table des codes promo
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,                    -- Code promo (ex: BIENVENUE10)
  description TEXT,                                     -- Description interne
  discount_type VARCHAR(20) NOT NULL,                  -- 'percentage' ou 'fixed'
  discount_value INTEGER NOT NULL,                      -- Valeur (pourcentage ou montant fixe en FCFA)
  min_order_amount INTEGER DEFAULT 0,                   -- Montant minimum de commande requis
  max_discount INTEGER,                                 -- Plafond de réduction (pour les %)
  usage_limit INTEGER,                                  -- Nombre max d'utilisations (null = illimité)
  usage_count INTEGER DEFAULT 0,                        -- Nombre d'utilisations actuelles
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),    -- Date de début de validité
  expires_at TIMESTAMP WITH TIME ZONE,                  -- Date d'expiration (null = pas d'expiration)
  is_active BOOLEAN DEFAULT true,                       -- Actif ou non
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table pour suivre l'utilisation des codes promo
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  discount_applied INTEGER NOT NULL,                    -- Montant de la réduction appliquée
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_expires ON promo_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_promo_usage_code ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_email ON promo_code_usage(customer_email);

-- 4. Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON promo_codes;
CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Policies RLS pour promo_codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Codes promo visibles par tous" ON promo_codes;
CREATE POLICY "Codes promo visibles par tous" ON promo_codes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Codes promo modifiables" ON promo_codes;
CREATE POLICY "Codes promo modifiables" ON promo_codes
  FOR ALL USING (true);

-- 6. Policies RLS pour promo_code_usage
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usage codes promo visible" ON promo_code_usage;
CREATE POLICY "Usage codes promo visible" ON promo_code_usage
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usage codes promo insertable" ON promo_code_usage;
CREATE POLICY "Usage codes promo insertable" ON promo_code_usage
  FOR INSERT WITH CHECK (true);

-- 7. Fonction pour valider un code promo
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code VARCHAR,
  p_order_amount INTEGER,
  p_customer_email VARCHAR
)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_message TEXT,
  promo_id UUID,
  discount_type VARCHAR,
  discount_value INTEGER,
  max_discount INTEGER,
  calculated_discount INTEGER
) AS $$
DECLARE
  v_promo RECORD;
  v_calculated_discount INTEGER;
BEGIN
  -- Chercher le code promo
  SELECT * INTO v_promo FROM promo_codes 
  WHERE UPPER(code) = UPPER(p_code) AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Code promo invalide'::TEXT, NULL::UUID, NULL::VARCHAR, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Vérifier la date de début
  IF v_promo.starts_at > NOW() THEN
    RETURN QUERY SELECT false, 'Ce code promo n''est pas encore actif'::TEXT, NULL::UUID, NULL::VARCHAR, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Vérifier la date d'expiration
  IF v_promo.expires_at IS NOT NULL AND v_promo.expires_at < NOW() THEN
    RETURN QUERY SELECT false, 'Ce code promo a expiré'::TEXT, NULL::UUID, NULL::VARCHAR, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Vérifier le montant minimum
  IF p_order_amount < v_promo.min_order_amount THEN
    RETURN QUERY SELECT false, ('Montant minimum requis: ' || v_promo.min_order_amount || ' FCFA')::TEXT, NULL::UUID, NULL::VARCHAR, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Vérifier la limite d'utilisation globale
  IF v_promo.usage_limit IS NOT NULL AND v_promo.usage_count >= v_promo.usage_limit THEN
    RETURN QUERY SELECT false, 'Ce code promo a atteint sa limite d''utilisation'::TEXT, NULL::UUID, NULL::VARCHAR, NULL::INTEGER, NULL::INTEGER, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Calculer la réduction
  IF v_promo.discount_type = 'percentage' THEN
    v_calculated_discount := (p_order_amount * v_promo.discount_value) / 100;
    -- Appliquer le plafond si défini
    IF v_promo.max_discount IS NOT NULL AND v_calculated_discount > v_promo.max_discount THEN
      v_calculated_discount := v_promo.max_discount;
    END IF;
  ELSE
    v_calculated_discount := v_promo.discount_value;
  END IF;
  
  -- Ne pas dépasser le montant de la commande
  IF v_calculated_discount > p_order_amount THEN
    v_calculated_discount := p_order_amount;
  END IF;
  
  RETURN QUERY SELECT 
    true, 
    NULL::TEXT, 
    v_promo.id, 
    v_promo.discount_type::VARCHAR, 
    v_promo.discount_value, 
    v_promo.max_discount,
    v_calculated_discount;
END;
$$ LANGUAGE plpgsql;

-- 8. Vérification
SELECT 'Schema codes promo créé avec succès!' as message;


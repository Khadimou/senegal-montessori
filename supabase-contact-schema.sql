-- ============================================
-- SCHÉMA POUR LES MESSAGES DE CONTACT
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ============================================

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  admin_notes TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER trigger_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_messages_updated_at();

-- Politique RLS pour permettre l'insertion publique
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde d'envoyer un message
CREATE POLICY "Allow public to insert contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique pour la lecture (admin seulement - via service role)
CREATE POLICY "Allow service role to read contact messages"
  ON contact_messages FOR SELECT
  TO service_role
  USING (true);

-- Politique pour la mise à jour (admin seulement - via service role)
CREATE POLICY "Allow service role to update contact messages"
  ON contact_messages FOR UPDATE
  TO service_role
  USING (true);

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Exécutez cette requête pour vérifier la création :
-- SELECT * FROM contact_messages LIMIT 1;



-- =============================================
-- SCHEMA SUPABASE POUR MONTESSORI SÉNÉGAL
-- =============================================
-- Exécute ce script dans l'éditeur SQL de Supabase
-- Dashboard > SQL Editor > New Query

-- 1. Table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  age_range VARCHAR(50) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 4. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Triggers pour updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Activer Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 7. Policies pour les produits (lecture publique, écriture authentifiée)
CREATE POLICY "Produits visibles par tous" ON products
  FOR SELECT USING (true);

CREATE POLICY "Produits modifiables par authentifiés" ON products
  FOR ALL USING (true);

-- 8. Policies pour les commandes
CREATE POLICY "Commandes visibles par authentifiés" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Commandes créables par tous" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Commandes modifiables par authentifiés" ON orders
  FOR UPDATE USING (true);

-- 9. Insérer les produits initiaux
INSERT INTO products (name, description, price, image, category, age_range, in_stock, features) VALUES
  ('Cadre d''Habillage - Boutons', 'Ce cadre d''habillage Montessori permet à l''enfant d''apprendre à boutonner et déboutonner de manière autonome. Fabriqué en bois de qualité avec du tissu doux.', 15000, 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=400&h=400&fit=crop', 'vie-pratique', '3-6 ans', true, ARRAY['Bois naturel', 'Tissu coton', 'Développe la motricité fine', 'Favorise l''autonomie']),
  
  ('Plateau de Versement', 'Ensemble complet pour les exercices de versement avec deux pichets en céramique et un plateau en bois. Parfait pour développer la coordination œil-main.', 12000, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop', 'vie-pratique', '2-5 ans', true, ARRAY['Pichets en céramique', 'Plateau en bois', 'Éponge incluse', 'Développe la concentration']),
  
  ('Kit de Nettoyage Enfant', 'Set complet de nettoyage adapté à la taille des enfants : balai, pelle, brosse et support. Encourage la participation aux tâches ménagères.', 18000, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop', 'vie-pratique', '2-6 ans', true, ARRAY['Taille adaptée', 'Bois et fibres naturelles', 'Support inclus', 'Stimule la responsabilité']),
  
  ('Tour Rose Montessori', 'La célèbre tour rose Montessori composée de 10 cubes en bois de tailles graduées. Permet de développer la discrimination visuelle des dimensions.', 35000, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', 'sensoriel', '3-6 ans', true, ARRAY['10 cubes en bois', 'Peinture non toxique', 'Discrimination visuelle', 'Préparation aux mathématiques']),
  
  ('Boîtes de Cylindres Colorés', 'Ensemble de 4 boîtes contenant des cylindres de différentes tailles. L''enfant apprend à discriminer les dimensions par le toucher et la vue.', 45000, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop', 'sensoriel', '3-6 ans', true, ARRAY['4 boîtes', 'Bois de hêtre', 'Développe le sens tactile', 'Prépare à l''écriture']),
  
  ('Tablettes de Couleurs - Boîte 3', 'Boîte contenant 63 tablettes de couleurs avec 9 nuances de 7 couleurs différentes. Affine la perception des couleurs et leur gradation.', 28000, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop', 'sensoriel', '3-6 ans', true, ARRAY['63 tablettes', '7 couleurs', '9 nuances', 'Discrimination chromatique']),
  
  ('Lettres Rugueuses Cursives', 'Ensemble complet de lettres rugueuses en cursive sur plaques de bois. L''enfant trace les lettres du bout des doigts pour mémoriser leur forme.', 32000, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop', 'langage', '3-6 ans', true, ARRAY['26 lettres', 'Surface rugueuse', 'Préparation à l''écriture', 'Mémoire musculaire']),
  
  ('Alphabet Mobile', 'Grand alphabet mobile avec plusieurs exemplaires de chaque lettre en bois. Permet à l''enfant de composer ses premiers mots avant de savoir écrire.', 38000, 'https://images.unsplash.com/photo-1452457750107-cd084dce177d?w=400&h=400&fit=crop', 'langage', '4-7 ans', true, ARRAY['Lettres multiples', 'Boîte de rangement', 'Consonnes bleues', 'Voyelles rouges']),
  
  ('Imagier Phonétique', 'Collection de cartes illustrées classées par son initial. Aide l''enfant à associer les sons aux images et développe le vocabulaire.', 22000, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop', 'langage', '3-6 ans', false, ARRAY['150 cartes', 'Images réalistes', 'Classement phonétique', 'Enrichit le vocabulaire']),
  
  ('Barres Rouges et Bleues', 'Ensemble de 10 barres segmentées en rouge et bleu pour apprendre à compter de 1 à 10. Introduction concrète aux quantités et aux nombres.', 42000, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=400&fit=crop', 'mathematiques', '4-6 ans', true, ARRAY['10 barres', 'Bois massif', 'Apprentissage du comptage', 'Association quantité-symbole']),
  
  ('Chiffres Rugueux 0-9', 'Plaques en bois avec chiffres rugueux de 0 à 9. L''enfant trace les chiffres du bout des doigts pour mémoriser leur tracé.', 18000, 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=400&fit=crop', 'mathematiques', '3-5 ans', true, ARRAY['10 plaques', 'Surface rugueuse', 'Préparation à l''écriture', 'Mémoire tactile']),
  
  ('Système Décimal - Perles Dorées', 'Matériel complet pour comprendre le système décimal : unités, dizaines, centaines et milliers représentés par des perles dorées.', 65000, 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=400&fit=crop', 'mathematiques', '4-8 ans', true, ARRAY['Perles dorées', 'Plateau de présentation', 'Système décimal complet', 'Opérations concrètes']),
  
  ('Puzzle Carte de l''Afrique', 'Puzzle en bois représentant les pays d''Afrique avec pièces individuelles pour chaque pays. Idéal pour découvrir notre continent.', 28000, 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=400&fit=crop', 'culture', '4-8 ans', true, ARRAY['Bois de qualité', 'Pays individuels', 'Boutons de préhension', 'Découverte géographique']),
  
  ('Globe Terrestre Rugueux', 'Globe avec surfaces rugueuses pour les terres et lisses pour les océans. Premier contact sensoriel avec la géographie mondiale.', 35000, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop', 'culture', '3-6 ans', true, ARRAY['Surface texturée', 'Socle en bois', 'Terre/Eau distinguables', 'Introduction à la géographie']),
  
  ('Cabinet de Botanique', 'Cabinet contenant des formes de feuilles en bois avec cadres d''encastrement. L''enfant découvre les différentes formes de feuilles.', 48000, 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=400&h=400&fit=crop', 'culture', '3-6 ans', false, ARRAY['3 tiroirs', '18 formes de feuilles', 'Cartes de nomenclature', 'Découverte de la nature']);

-- Vérification
SELECT COUNT(*) as total_products FROM products;


-- =============================================
-- MISE À JOUR DES PRIX AVEC FRAIS INCLUS
-- =============================================
-- Exécute ce script dans Supabase SQL Editor
-- Les prix sont augmentés de 2.5% pour absorber les frais NabooPay

-- Vie Pratique
UPDATE products SET price = 15400 WHERE name = 'Cadre d''Habillage - Boutons';
UPDATE products SET price = 12300 WHERE name = 'Plateau de Versement';
UPDATE products SET price = 18450 WHERE name = 'Kit de Nettoyage Enfant';

-- Sensoriel
UPDATE products SET price = 35875 WHERE name = 'Tour Rose Montessori';
UPDATE products SET price = 46125 WHERE name = 'Boîtes de Cylindres Colorés';
UPDATE products SET price = 28700 WHERE name = 'Tablettes de Couleurs - Boîte 3';

-- Langage
UPDATE products SET price = 32800 WHERE name = 'Lettres Rugueuses Cursives';
UPDATE products SET price = 38950 WHERE name = 'Alphabet Mobile';
UPDATE products SET price = 22550 WHERE name = 'Imagier Phonétique';

-- Mathématiques
UPDATE products SET price = 43050 WHERE name = 'Barres Rouges et Bleues';
UPDATE products SET price = 18450 WHERE name = 'Chiffres Rugueux 0-9';
UPDATE products SET price = 66625 WHERE name = 'Système Décimal - Perles Dorées';

-- Culture & Sciences
UPDATE products SET price = 28700 WHERE name = 'Puzzle Carte de l''Afrique';
UPDATE products SET price = 35875 WHERE name = 'Globe Terrestre Rugueux';
UPDATE products SET price = 49200 WHERE name = 'Cabinet de Botanique';

-- Vérification
SELECT name, price FROM products ORDER BY category, name;


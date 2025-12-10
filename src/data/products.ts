import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'vie-pratique',
    name: 'Vie Pratique',
    description: 'Activités pour développer l\'autonomie et la coordination',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop'
  },
  {
    id: 'sensoriel',
    name: 'Matériel Sensoriel',
    description: 'Explorer les sens et affiner la perception',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop'
  },
  {
    id: 'langage',
    name: 'Langage',
    description: 'Développer les compétences en lecture et écriture',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop'
  },
  {
    id: 'mathematiques',
    name: 'Mathématiques',
    description: 'Apprendre les concepts mathématiques par la manipulation',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop'
  },
  {
    id: 'culture',
    name: 'Culture & Sciences',
    description: 'Découvrir le monde, la géographie et les sciences',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
  }
];

export const products: Product[] = [
  // Vie Pratique
  {
    id: 'cadre-habillage-boutons',
    name: 'Cadre d\'Habillage - Boutons',
    description: 'Ce cadre d\'habillage Montessori permet à l\'enfant d\'apprendre à boutonner et déboutonner de manière autonome. Fabriqué en bois de qualité avec du tissu doux.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=400&h=400&fit=crop',
    category: 'vie-pratique',
    ageRange: '3-6 ans',
    inStock: true,
    features: ['Bois naturel', 'Tissu coton', 'Développe la motricité fine', 'Favorise l\'autonomie']
  },
  {
    id: 'plateau-versement',
    name: 'Plateau de Versement',
    description: 'Ensemble complet pour les exercices de versement avec deux pichets en céramique et un plateau en bois. Parfait pour développer la coordination œil-main.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
    category: 'vie-pratique',
    ageRange: '2-5 ans',
    inStock: true,
    features: ['Pichets en céramique', 'Plateau en bois', 'Éponge incluse', 'Développe la concentration']
  },
  {
    id: 'kit-nettoyage-enfant',
    name: 'Kit de Nettoyage Enfant',
    description: 'Set complet de nettoyage adapté à la taille des enfants : balai, pelle, brosse et support. Encourage la participation aux tâches ménagères.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop',
    category: 'vie-pratique',
    ageRange: '2-6 ans',
    inStock: true,
    features: ['Taille adaptée', 'Bois et fibres naturelles', 'Support inclus', 'Stimule la responsabilité']
  },

  // Sensoriel
  {
    id: 'tour-rose',
    name: 'Tour Rose Montessori',
    description: 'La célèbre tour rose Montessori composée de 10 cubes en bois de tailles graduées. Permet de développer la discrimination visuelle des dimensions.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    category: 'sensoriel',
    ageRange: '3-6 ans',
    inStock: true,
    features: ['10 cubes en bois', 'Peinture non toxique', 'Discrimination visuelle', 'Préparation aux mathématiques']
  },
  {
    id: 'cylindres-couleurs',
    name: 'Boîtes de Cylindres Colorés',
    description: 'Ensemble de 4 boîtes contenant des cylindres de différentes tailles. L\'enfant apprend à discriminer les dimensions par le toucher et la vue.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
    category: 'sensoriel',
    ageRange: '3-6 ans',
    inStock: true,
    features: ['4 boîtes', 'Bois de hêtre', 'Développe le sens tactile', 'Prépare à l\'écriture']
  },
  {
    id: 'tablettes-couleurs',
    name: 'Tablettes de Couleurs - Boîte 3',
    description: 'Boîte contenant 63 tablettes de couleurs avec 9 nuances de 7 couleurs différentes. Affine la perception des couleurs et leur gradation.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    category: 'sensoriel',
    ageRange: '3-6 ans',
    inStock: true,
    features: ['63 tablettes', '7 couleurs', '9 nuances', 'Discrimination chromatique']
  },

  // Langage
  {
    id: 'lettres-rugueuses',
    name: 'Lettres Rugueuses Cursives',
    description: 'Ensemble complet de lettres rugueuses en cursive sur plaques de bois. L\'enfant trace les lettres du bout des doigts pour mémoriser leur forme.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    category: 'langage',
    ageRange: '3-6 ans',
    inStock: true,
    features: ['26 lettres', 'Surface rugueuse', 'Préparation à l\'écriture', 'Mémoire musculaire']
  },
  {
    id: 'alphabet-mobile',
    name: 'Alphabet Mobile',
    description: 'Grand alphabet mobile avec plusieurs exemplaires de chaque lettre en bois. Permet à l\'enfant de composer ses premiers mots avant de savoir écrire.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1452457750107-cd084dce177d?w=400&h=400&fit=crop',
    category: 'langage',
    ageRange: '4-7 ans',
    inStock: true,
    features: ['Lettres multiples', 'Boîte de rangement', 'Consonnes bleues', 'Voyelles rouges']
  },
  {
    id: 'imagier-phonetique',
    name: 'Imagier Phonétique',
    description: 'Collection de cartes illustrées classées par son initial. Aide l\'enfant à associer les sons aux images et développe le vocabulaire.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop',
    category: 'langage',
    ageRange: '3-6 ans',
    inStock: false,
    features: ['150 cartes', 'Images réalistes', 'Classement phonétique', 'Enrichit le vocabulaire']
  },

  // Mathématiques
  {
    id: 'barres-rouges-bleues',
    name: 'Barres Rouges et Bleues',
    description: 'Ensemble de 10 barres segmentées en rouge et bleu pour apprendre à compter de 1 à 10. Introduction concrète aux quantités et aux nombres.',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=400&fit=crop',
    category: 'mathematiques',
    ageRange: '4-6 ans',
    inStock: true,
    features: ['10 barres', 'Bois massif', 'Apprentissage du comptage', 'Association quantité-symbole']
  },
  {
    id: 'chiffres-rugueux',
    name: 'Chiffres Rugueux 0-9',
    description: 'Plaques en bois avec chiffres rugueux de 0 à 9. L\'enfant trace les chiffres du bout des doigts pour mémoriser leur tracé.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=400&fit=crop',
    category: 'mathematiques',
    ageRange: '3-5 ans',
    inStock: true,
    features: ['10 plaques', 'Surface rugueuse', 'Préparation à l\'écriture', 'Mémoire tactile']
  },
  {
    id: 'perles-dorees',
    name: 'Système Décimal - Perles Dorées',
    description: 'Matériel complet pour comprendre le système décimal : unités, dizaines, centaines et milliers représentés par des perles dorées.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=400&fit=crop',
    category: 'mathematiques',
    ageRange: '4-8 ans',
    inStock: true,
    features: ['Perles dorées', 'Plateau de présentation', 'Système décimal complet', 'Opérations concrètes']
  },

  // Culture & Sciences
  {
    id: 'puzzle-afrique',
    name: 'Puzzle Carte de l\'Afrique',
    description: 'Puzzle en bois représentant les pays d\'Afrique avec pièces individuelles pour chaque pays. Idéal pour découvrir notre continent.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&h=400&fit=crop',
    category: 'culture',
    ageRange: '4-8 ans',
    inStock: true,
    features: ['Bois de qualité', 'Pays individuels', 'Boutons de préhension', 'Découverte géographique']
  },
  {
    id: 'globe-rugueux',
    name: 'Globe Terrestre Rugueux',
    description: 'Globe avec surfaces rugueuses pour les terres et lisses pour les océans. Premier contact sensoriel avec la géographie mondiale.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    category: 'culture',
    ageRange: '3-6 ans',
    inStock: true,
    features: ['Surface texturée', 'Socle en bois', 'Terre/Eau distinguables', 'Introduction à la géographie']
  },
  {
    id: 'cabinet-botanique',
    name: 'Cabinet de Botanique',
    description: 'Cabinet contenant des formes de feuilles en bois avec cadres d\'encastrement. L\'enfant découvre les différentes formes de feuilles.',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=400&h=400&fit=crop',
    category: 'culture',
    ageRange: '3-6 ans',
    inStock: false,
    features: ['3 tiroirs', '18 formes de feuilles', 'Cartes de nomenclature', 'Découverte de la nature']
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};


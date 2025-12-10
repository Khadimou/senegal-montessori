# 🧸 Montessori Sénégal

Boutique e-commerce de jouets éducatifs Montessori au Sénégal.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## 🌟 Fonctionnalités

- **Catalogue produits** - Navigation par catégories (Vie Pratique, Sensoriel, Langage, Mathématiques, Culture)
- **Panier d'achat** - Gestion complète avec persistence locale
- **Design responsive** - Optimisé mobile et desktop
- **Animations fluides** - Avec Framer Motion
- **SEO optimisé** - Métadonnées et Open Graph

## 🚀 Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) avec App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **État**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icônes**: [Lucide React](https://lucide.dev/)

## 📦 Installation

```bash
# Cloner le repo
git clone https://github.com/Khadimou/senegal-montessori.git

# Aller dans le dossier
cd senegal-montessori

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🌐 Déploiement Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Khadimou/senegal-montessori)

Ou via CLI:

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── produits/          # Pages produits
│   ├── panier/            # Page panier
│   ├── contact/           # Page contact
│   └── a-propos/          # Page à propos
├── components/            # Composants React
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   └── CartSlider.tsx
├── data/                  # Données statiques
│   └── products.ts
├── store/                 # État global (Zustand)
│   └── cart.ts
└── types/                 # Types TypeScript
    └── index.ts
```

## 🎨 Personnalisation

### Couleurs
Les couleurs principales utilisent la palette Tailwind `amber` et `orange`. Modifiez `tailwind.config.ts` pour personnaliser.

### Produits
Ajoutez ou modifiez les produits dans `src/data/products.ts`.

### Images
Les images utilisent Unsplash. Remplacez par vos propres images en mettant à jour les URLs dans `products.ts`.

## 📄 Licence

MIT © 2024 Montessori Sénégal

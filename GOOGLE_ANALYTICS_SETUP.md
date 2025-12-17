# Configuration Google Analytics 4

## 📊 Événements Trackés

### E-commerce
- ✅ **view_item** - Vue d'un produit
- ✅ **add_to_cart** - Ajout au panier
- ✅ **remove_from_cart** - Retrait du panier
- ✅ **begin_checkout** - Début du checkout
- ✅ **add_promo_code** - Utilisation d'un code promo
- ✅ **purchase** - Achat complété

### Engagement
- ✅ **search** - Recherche de produits
- ✅ **preorder_request** - Demande liste d'attente

### Automatique
- ✅ **page_view** - Vues de pages (automatique)
- ✅ **scroll** - Scroll (automatique)
- ✅ **click** - Clics (automatique)

## 🚀 Étapes de Configuration

### 1. Créer un compte Google Analytics

1. Aller sur [analytics.google.com](https://analytics.google.com)
2. Cliquer sur "Commencer la mesure"
3. Créer un **Compte** (ex: "Senegal Montessori")
4. Créer une **Propriété** (ex: "senegal-montessori.store")
   - Sélectionner "Web"
   - Activer **Enhanced measurement** (mesure améliorée)
5. Créer un **Flux de données Web**
   - URL du site: `https://senegal-montessori.vercel.app` (ou ton domaine)
   - Nom du flux: "Site Web Principal"

### 2. Récupérer l'ID de mesure

Après la création, tu verras quelque chose comme :
```
G-XXXXXXXXXX
```

C'est ton **Measurement ID** (ID de mesure).

### 3. Ajouter dans Vercel

1. Va sur ton projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoute :
   ```
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
   ```
4. **Redéploie** le projet (ou push un commit)

### 4. Vérifier que ça fonctionne

1. Va sur Google Analytics → **Rapports** → **Temps réel**
2. Visite ton site
3. Tu devrais voir ton activité en temps réel !

## 📈 Rapports Utiles

### E-commerce

**Menu : Monétisation → Achats**
- Revenus
- Transactions
- Valeur moyenne des commandes

**Menu : Monétisation → Vue d'ensemble**
- Revenus totaux
- Taux de conversion
- Valeur client

### Engagement Utilisateur

**Menu : Engagement → Événements**
- Tous les événements personnalisés
- preorder_request, add_to_cart, etc.

**Menu : Engagement → Pages et écrans**
- Pages les plus visitées
- Temps passé par page

### Acquisition

**Menu : Acquisition → Vue d'ensemble**
- D'où viennent tes visiteurs
- Réseaux sociaux, Google, direct, etc.

## 🎯 KPIs Clés à Suivre

### Conversions
- **Taux de conversion** : % de visiteurs qui achètent
- **Panier moyen** : Valeur moyenne par commande
- **Abandon de panier** : % de checkouts non complétés

### Engagement
- **Pages par session** : Combien de pages en moyenne
- **Durée de session** : Temps passé sur le site
- **Taux de rebond** : % qui partent immédiatement

### Produits
- **Produits les plus vus**
- **Produits les plus achetés**
- **Produits en liste d'attente** (preorder_request)

## 🔔 Alertes Personnalisées

Tu peux créer des alertes dans GA4 pour être notifié quand :
- Les ventes baissent de X%
- Un pic de trafic inhabituel
- Taux de conversion en baisse

## 📱 Application Mobile

Télécharge l'app **Google Analytics** (iOS/Android) pour suivre tes stats en temps réel depuis ton téléphone !

## 🎓 Ressources

- [Documentation GA4](https://support.google.com/analytics/answer/10089681)
- [Guide E-commerce GA4](https://support.google.com/analytics/answer/9268036)
- [Academy GA4](https://skillshop.exceedlms.com/student/catalog/list?category_ids=6431-google-analytics-4)



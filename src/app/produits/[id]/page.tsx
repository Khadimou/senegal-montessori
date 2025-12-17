import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Product } from '@/types';
import { DbProduct } from '@/lib/supabase';
import { products as staticProducts } from '@/data/products';
import { formatPrice } from '@/data/products';
import ProductDetails from '@/components/ProductDetails';

// Créer un client Supabase pour le SSR
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Convertir du format DB vers le format App
const dbToProduct = (db: DbProduct): Product => {
  const stockQuantity = db.stock_quantity || 0;
  const hasStockManagement = db.stock_quantity !== null && db.stock_quantity !== undefined;
  const inStock = hasStockManagement ? stockQuantity > 0 : db.in_stock;

  return {
    id: db.id,
    name: db.name,
    description: db.description,
    price: db.price,
    images: db.images || [],
    image: db.images?.[0] || '',
    category: db.category,
    ageRange: db.age_range,
    inStock,
    features: db.features || [],
    costPrice: db.cost_price || 0,
    stockQuantity,
    minStockAlert: db.min_stock_alert || 5,
    supplier: db.supplier,
    totalSold: db.total_sold || 0,
  };
};

// Fonction pour récupérer un produit
async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      // Fallback vers les produits statiques
      const staticProduct = staticProducts.find(p => p.id === id);
      if (staticProduct) {
        return {
          ...staticProduct,
          images: staticProduct.image ? [staticProduct.image] : [],
        };
      }
      return null;
    }

    return dbToProduct(data);
  } catch {
    // Fallback vers les produits statiques
    const staticProduct = staticProducts.find(p => p.id === id);
    if (staticProduct) {
      return {
        ...staticProduct,
        images: staticProduct.image ? [staticProduct.image] : [],
      };
    }
    return null;
  }
}

// Fonction pour récupérer tous les produits (pour les produits similaires)
async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return staticProducts.map(p => ({
        ...p,
        images: p.image ? [p.image] : [],
      }));
    }

    return data.map(dbToProduct);
  } catch {
    return staticProducts.map(p => ({
      ...p,
      images: p.image ? [p.image] : [],
    }));
  }
}

// Génération des métadonnées dynamiques pour SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Produit non trouvé | Montessori Sénégal',
      description: 'Ce produit n\'existe pas ou n\'est plus disponible.',
    };
  }

  const title = `${product.name} - Jouet Montessori ${product.ageRange} | Montessori Sénégal`;
  const description = `${product.description.slice(0, 150)}... Prix: ${formatPrice(product.price)}. Livraison Dakar. Paiement Wave/Orange Money.`;
  const imageUrl = product.images[0] || product.image || '';

  return {
    title,
    description,
    keywords: [
      product.name,
      'Montessori',
      'jouet éducatif',
      product.category,
      'Sénégal',
      'Dakar',
      product.ageRange,
      'cadeau enfant',
    ],
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      locale: 'fr_SN',
      siteName: 'Montessori Sénégal',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// Composant JSON-LD pour les données structurées
function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Montessori Sénégal',
    },
    offers: {
      '@type': 'Offer',
      url: `https://senegal-montessori.store/produits/${product.id}`,
      priceCurrency: 'XOF',
      price: product.price,
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Montessori Sénégal',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'SN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
    category: product.category,
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: product.ageRange.split('-')[0]?.trim() || '0',
      suggestedMaxAge: product.ageRange.split('-')[1]?.replace(/[^0-9]/g, '') || '12',
    },
    additionalProperty: product.features.map(feature => ({
      '@type': 'PropertyValue',
      name: 'Caractéristique',
      value: feature,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Page principale (Server Component)
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, allProducts] = await Promise.all([
    getProduct(id),
    getAllProducts(),
  ]);

  if (!product) {
    notFound();
  }

  // Produits similaires (même catégorie, différent ID)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      {/* JSON-LD pour les données structurées Google */}
      <ProductJsonLd product={product} />
      
      {/* Composant client pour les interactions */}
      <ProductDetails product={product} relatedProducts={relatedProducts} />
    </>
  );
}

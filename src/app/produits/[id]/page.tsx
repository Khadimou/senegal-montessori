'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RotateCcw, Check, Minus, Plus, Clock } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { useProductsStore } from '@/store/products';
import ProductCard from '@/components/ProductCard';
import ImageGallery from '@/components/ImageGallery';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { products, isLoading, fetchProducts, lastFetch } = useProductsStore();
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // S'assurer que les produits sont chargés
    if (!lastFetch) {
      fetchProducts();
    }
  }, [lastFetch, fetchProducts]);

  // Afficher le chargement si les produits ne sont pas encore chargés
  if (!mounted || (isLoading && products.length === 0) || (!lastFetch && products.length === 0)) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  const product = products.find(p => p.id === id);

  // Seulement afficher 404 si les produits sont chargés mais le produit n'existe pas
  if (!product && lastFetch) {
    notFound();
  }

  // Sécurité supplémentaire pendant le chargement
  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    openCart();
  };

  // Utiliser images si disponible, sinon fallback sur image
  const productImages = product.images?.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la boutique
          </Link>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <ImageGallery images={productImages} alt={product.name} />
            {!product.inStock && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-amber-600 text-white font-medium rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Précommande disponible
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-amber-600 font-medium uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-stone-800">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-amber-600">
                {formatPrice(product.price)}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                {product.ageRange}
              </span>
            </div>

            <p className="mt-6 text-lg text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mt-8">
              <h3 className="font-semibold text-stone-800 mb-4">Caractéristiques</h3>
              <ul className="grid grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-stone-600">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Info précommande si rupture */}
            {!product.inStock && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800">Précommande disponible</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Ce produit est actuellement en rupture de stock. Précommandez-le maintenant et recevez-le dès qu&apos;il sera disponible (délai estimé: 1-2 semaines).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stock disponible */}
            {product.inStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && (
              <div className="mt-6">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  product.stockQuantity <= 3 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {product.stockQuantity <= 3 
                    ? `⚠️ Plus que ${product.stockQuantity} en stock` 
                    : `✓ ${product.stockQuantity} en stock`
                  }
                </span>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 bg-white rounded-xl border border-stone-200 px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                  aria-label="Diminuer"
                >
                  <Minus className="w-5 h-5 text-stone-600" />
                </button>
                <span className="w-12 text-center font-semibold text-stone-800 text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                  aria-label="Augmenter"
                >
                  <Plus className="w-5 h-5 text-stone-600" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                  product.inStock 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-purple-500/25'
                }`}
              >
                {product.inStock ? (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Ajouter au panier
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Précommander
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-stone-100">
                <Truck className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs text-stone-600">Livraison Dakar</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-stone-100">
                <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs text-stone-600">Qualité garantie</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-stone-100">
                <RotateCcw className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs text-stone-600">Retour 14 jours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-8">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

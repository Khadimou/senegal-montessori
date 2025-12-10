'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { useProductsStore } from '@/store/products';
import ProductCard from '@/components/ProductCard';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { products } = useProductsStore();
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
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
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="px-6 py-3 bg-white text-stone-800 font-semibold rounded-xl">
                  Rupture de stock
                </span>
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
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                Ajouter au panier
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

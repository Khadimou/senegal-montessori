'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Clock } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/data/products';
import { useCartStore } from '@/store/cart';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Permettre l'ajout même si rupture (précommande)
    addItem(product);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/produits/${product.id}`} className="block">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-stone-100">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-stone-400" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.price > 10000 && (
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  🎁 Livraison gratuite
                </span>
              )}
              {!product.inStock && (
                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Précommande
                </span>
              )}
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                {product.ageRange}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center transition-colors ${
                  product.inStock 
                    ? 'text-amber-600 hover:bg-amber-500 hover:text-white' 
                    : 'text-purple-600 hover:bg-purple-500 hover:text-white'
                }`}
                aria-label={product.inStock ? "Ajouter au panier" : "Précommander"}
              >
                {product.inStock ? <ShoppingBag className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-800 hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-stone-800 group-hover:text-amber-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="mt-2 text-stone-500 text-sm line-clamp-2">
              {product.description}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-amber-600">
                  {formatPrice(product.price)}
                </span>
                {product.stockQuantity !== undefined && product.stockQuantity > 0 ? (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.stockQuantity <= 3 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-emerald-600 bg-emerald-50'
                  }`}>
                    {product.stockQuantity <= 3 
                      ? `⚠️ Plus que ${product.stockQuantity}` 
                      : `✓ ${product.stockQuantity} en stock`
                    }
                  </span>
                ) : product.inStock ? (
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                    ✓ En stock
                  </span>
                ) : (
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                    ⏳ Précommande
                  </span>
                )}
              </div>
              {product.price <= 10000 && (
                <p className="text-xs text-stone-500">
                  + {formatPrice(3000)} de livraison
                </p>
              )}
              {product.price > 10000 && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ Livraison gratuite incluse
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


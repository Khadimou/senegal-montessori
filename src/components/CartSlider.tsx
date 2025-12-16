'use client';

import { Fragment } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/data/products';

export default function CartSlider() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Slider */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-800">Votre Panier</h2>
                  <p className="text-sm text-stone-500">{items.length} article{items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-stone-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-12 h-12 text-amber-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-700 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-stone-500 mb-6">
                    Découvrez nos jouets Montessori pour enfants
                  </p>
                  <Link
                    href="/produits"
                    onClick={closeCart}
                    className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
                  >
                    Voir la boutique
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 bg-stone-50 rounded-2xl"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-stone-800 truncate">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-amber-600 font-semibold">{formatPrice(item.price)}</p>
                          {!item.inStock && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Précommande
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="w-4 h-4 text-stone-600" />
                          </button>
                          <span className="w-8 text-center font-medium text-stone-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="w-4 h-4 text-stone-600" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone-100 p-6 space-y-4 bg-stone-50">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Sous-total</span>
                  <span className="text-xl font-bold text-stone-800">{formatPrice(getTotalPrice())}</span>
                </div>
                <p className="text-sm text-stone-500">
                  Livraison calculée à la prochaine étape
                </p>
                <Link
                  href="/panier"
                  onClick={closeCart}
                  className="block w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
                >
                  Voir le panier
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


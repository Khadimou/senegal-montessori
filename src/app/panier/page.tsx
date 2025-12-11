'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/data/products';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
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

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-4">Votre panier est vide</h1>
          <p className="text-stone-600 mb-8 max-w-md mx-auto">
            Vous n&apos;avez pas encore ajouté de produits à votre panier. Découvrez notre collection de jouets Montessori.
          </p>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            Découvrir la boutique
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Continuer mes achats
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800">Mon Panier</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Vider le panier
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <Link
                    href={`/produits/${item.id}`}
                    className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 group bg-stone-100"
                  >
                    {(item.images?.[0] || item.image) && (
                      <Image
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                          {item.category.replace('-', ' ')}
                        </span>
                        <Link href={`/produits/${item.id}`}>
                          <h3 className="text-lg font-semibold text-stone-800 hover:text-amber-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-stone-500 text-sm">{item.ageRange}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-5 h-5 text-stone-600" />
                        </button>
                        <span className="w-12 text-center font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-5 h-5 text-stone-600" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-stone-500">
                            {formatPrice(item.price)} / unité
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-28"
            >
              <h2 className="text-xl font-bold text-stone-800 mb-6">Résumé de la commande</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Livraison
                  </span>
                  <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-stone-500">
                    Livraison gratuite à partir de {formatPrice(50000)}
                  </p>
                )}
                <div className="border-t border-stone-100 pt-4">
                  <div className="flex justify-between text-lg font-bold text-stone-800">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
              >
                <CreditCard className="w-5 h-5" />
                Passer la commande
              </Link>

              <p className="mt-4 text-xs text-stone-500 text-center">
                🔒 Paiement sécurisé par NabooPay
              </p>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-sm text-stone-600 text-center mb-3">Modes de paiement acceptés</p>
                <div className="flex justify-center gap-3">
                  <div className="px-3 py-2 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">Wave</span>
                  </div>
                  <div className="px-3 py-2 bg-orange-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">Orange Money</span>
                  </div>
                  <div className="px-3 py-2 bg-purple-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">Free Money</span>
                  </div>
                  <div className="px-3 py-2 bg-stone-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-stone-600">Banque</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

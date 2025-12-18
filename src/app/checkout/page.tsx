'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Loader2,
  ShoppingBag,
  Check,
  Tag,
  X,
  Percent,
  Gift
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { usePromoStore } from '@/store/promo';
import { formatPrice } from '@/data/products';
import { ExtendedPaymentMethod } from '@/lib/naboopay';
import { PromoCodeValidation } from '@/types';
import * as analytics from '@/lib/analytics';
import * as metaPixel from '@/lib/meta-pixel';

const paymentMethods: { id: ExtendedPaymentMethod; name: string; icon: string; color: string; description?: string }[] = [
  { id: 'COD', name: 'À la livraison', icon: '💵', color: 'bg-emerald-500', description: 'Payez en espèces à la réception' },
  { id: 'WAVE', name: 'Wave', icon: '🌊', color: 'bg-blue-500' },
  { id: 'ORANGE_MONEY', name: 'Orange Money', icon: '🟠', color: 'bg-orange-500' },
  { id: 'FREE_MONEY', name: 'Free Money', icon: '💜', color: 'bg-purple-500' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { validatePromoCode } = usePromoStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ExtendedPaymentMethod>('COD');
  
  // États pour le code promo
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeValidation | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fonction pour valider le code promo
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    setPromoError(null);
    
    const subtotal = getTotalPrice();
    const validation = await validatePromoCode(promoCode, subtotal, formData.email || 'client@email.com');
    
    if (validation.is_valid) {
      setAppliedPromo(validation);
      setPromoError(null);
      
      // Analytics: track promo code usage
      if (validation.calculated_discount) {
        analytics.addPromoCode(promoCode, validation.calculated_discount);
      }
    } else {
      setPromoError(validation.error_message || 'Code invalide');
      setAppliedPromo(null);
    }
    
    setPromoLoading(false);
  };

  // Fonction pour retirer le code promo
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError(null);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Votre panier est vide</h1>
          <p className="text-stone-600 mb-6">
            Ajoutez des produits avant de passer à la caisse
          </p>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 10000 ? 0 : 3000; // Livraison gratuite à partir de 10,000 FCFA
  // Les frais NabooPay sont déjà inclus dans les prix des produits
  const discount = appliedPromo?.calculated_discount || 0;
  const total = subtotal + shipping - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Analytics: track begin checkout (Google Analytics + Meta Pixel)
    analytics.beginCheckout(
      items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: item.quantity,
      })),
      total
    );
    metaPixel.initiateCheckout({
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      numItems: items.reduce((sum, item) => sum + item.quantity, 0),
    });
    metaPixel.addPaymentInfo({
      total,
      paymentMethod: selectedPayment,
    });

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
            description: item.description,
          })),
          paymentMethod: selectedPayment,
          shipping: shipping, // Ajouter les frais de livraison
          // Informations code promo
          promoCode: appliedPromo ? {
            id: appliedPromo.promo_id,
            code: promoCode,
            discount: discount,
          } : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du checkout');
      }

      // Vider le panier
      clearCart();
      
      // Rediriger selon le type de paiement
      if (data.is_cod) {
        // Paiement à la livraison - rediriger vers page succès
        router.push(`/checkout/success?order_id=${data.order_id}&cod=true`);
      } else if (data.checkout_url) {
        // Paiement en ligne - rediriger vers NabooPay
        window.location.href = data.checkout_url;
      } else {
        throw new Error('URL de paiement non reçue');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au panier
          </Link>
          <h1 className="text-3xl font-bold text-stone-800">Finaliser la commande</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations client */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
              >
                <h2 className="text-xl font-semibold text-stone-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  Informations de livraison
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="+221 77 XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Adresse de livraison *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Quartier, Ville"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Méthode de paiement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
              >
                <h2 className="text-xl font-semibold text-stone-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  Mode de paiement
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedPayment === method.id
                          ? method.id === 'COD' ? 'border-emerald-500 bg-emerald-50' : 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {selectedPayment === method.id && (
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                          method.id === 'COD' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="text-sm font-medium text-stone-700">{method.name}</div>
                      {method.description && (
                        <div className="text-xs text-stone-500 mt-1">{method.description}</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Message informatif pour paiement à la livraison */}
                {selectedPayment === 'COD' && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-sm text-emerald-800">
                      💵 <strong>Paiement à la livraison</strong> : Vous payez en espèces au livreur lors de la réception de votre commande. Aucun paiement en ligne requis.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Erreur */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Résumé commande */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-28"
              >
                <h2 className="text-xl font-semibold text-stone-800 mb-6">
                  Récapitulatif
                </h2>

                {/* Produits */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {(item.images?.[0] || item.image) && (
                          <Image
                            src={item.images?.[0] || item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-stone-500">Qté: {item.quantity}</p>
                        <p className="text-sm font-semibold text-amber-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Code promo */}
                <div className="border-t border-stone-100 pt-4 mb-4">
                  <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    Code promo
                  </h3>
                  
                  {appliedPromo ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-emerald-600" />
                          <div>
                            <span className="font-mono font-bold text-emerald-700">{promoCode}</span>
                            <p className="text-xs text-emerald-600">
                              {appliedPromo.discount_type === 'percentage' 
                                ? `${appliedPromo.discount_value}% de réduction`
                                : `${formatPrice(appliedPromo.discount_value || 0)} de réduction`
                              }
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="p-1 text-emerald-600 hover:text-red-500 transition-colors"
                          title="Retirer le code"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
                          placeholder="Entrez votre code"
                          className="flex-1 px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoLoading || !promoCode.trim()}
                          className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-colors disabled:opacity-50 text-sm"
                        >
                          {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Appliquer'}
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {promoError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Totaux */}
                <div className="border-t border-stone-100 pt-4 space-y-3">
                  <div className="flex justify-between text-stone-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                  </div>
                  {appliedPromo && discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        Réduction
                      </span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  {shipping > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-stone-500">
                        Ajoutez {formatPrice(10000 - subtotal)} pour bénéficier de la livraison gratuite !
                      </p>
                      <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-semibold text-green-800">
                          🎁 Livraison gratuite partout au Sénégal dès {formatPrice(10000)}
                        </p>
                      </div>
                    </div>
                  )}
                  {shipping === 0 && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-semibold text-green-800">
                        ✅ Livraison gratuite incluse !
                      </p>
                    </div>
                  )}
                  
                  {/* Délais de livraison */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-800 mb-1">🚀 Livraison express</p>
                    <p className="text-xs text-blue-700">
                      • <strong>Dakar :</strong> en 2h chrono<br/>
                      • <strong>Régions :</strong> moins de 48h partout au Sénégal
                    </p>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-stone-800 pt-3 border-t border-stone-100">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(total)}</span>
                  </div>
                  
                  {/* Information frais inclus */}
                  <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-xs text-green-800">
                      ✅ <strong>Frais de paiement inclus</strong> - Aucun frais supplémentaire ne sera appliqué
                    </p>
                  </div>
                </div>

                {/* Bouton commander/payer */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-6 py-4 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    selectedPayment === 'COD' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {selectedPayment === 'COD' ? 'Validation...' : 'Redirection...'}
                    </>
                  ) : selectedPayment === 'COD' ? (
                    <>
                      <Check className="w-5 h-5" />
                      Confirmer la commande • {formatPrice(total)}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Payer {formatPrice(total)}
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3 pt-6 border-t border-stone-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="text-green-500">✓</span>
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="text-green-500">✓</span>
                      <span>Livraison rapide</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="text-green-500">✓</span>
                      <span>Garantie qualité</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="text-green-500">✓</span>
                      <span>Support client</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 text-center">
                    {selectedPayment === 'COD' 
                      ? '💵 Paiement à la livraison - Vous payez en espèces au livreur'
                      : '🔒 Paiement sécurisé par NabooPay'
                    }
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


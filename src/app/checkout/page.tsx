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
  Check
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/data/products';
import { PaymentMethod } from '@/lib/naboopay';

const paymentMethods: { id: PaymentMethod; name: string; icon: string; color: string }[] = [
  { id: 'WAVE', name: 'Wave', icon: '🌊', color: 'bg-blue-500' },
  { id: 'ORANGE_MONEY', name: 'Orange Money', icon: '🟠', color: 'bg-orange-500' },
  { id: 'FREE_MONEY', name: 'Free Money', icon: '💜', color: 'bg-purple-500' },
  { id: 'BANK', name: 'Virement Bancaire', icon: '🏦', color: 'bg-stone-600' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('WAVE');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shipping;
  
  // Estimation des frais NabooPay (~2% du montant)
  const estimatedFees = Math.ceil(total * 0.02);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du checkout');
      }

      // Rediriger vers la page de paiement NabooPay
      if (data.checkout_url) {
        // Vider le panier avant redirection
        clearCart();
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
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {selectedPayment === method.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="text-sm font-medium text-stone-700">{method.name}</div>
                    </button>
                  ))}
                </div>
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
                  {shipping > 0 && (
                    <p className="text-xs text-stone-500">
                      Livraison gratuite à partir de {formatPrice(50000)}
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-bold text-stone-800 pt-3 border-t border-stone-100">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(total)}</span>
                  </div>
                  
                  {/* Information frais */}
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-xs text-amber-800">
                      ℹ️ <strong>Frais de paiement :</strong> Des frais de transaction d'environ {formatPrice(estimatedFees)} seront appliqués par le service de paiement.
                    </p>
                  </div>
                </div>

                {/* Bouton payer */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Payer {formatPrice(total)}
                    </>
                  )}
                </button>

                <div className="mt-4 space-y-2">
                  <p className="text-xs text-stone-500 text-center">
                    🔒 Paiement sécurisé par NabooPay
                  </p>
                  <p className="text-xs text-stone-400 text-center">
                    Vos informations seront confirmées sur la page de paiement pour votre sécurité
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


'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import * as analytics from '@/lib/analytics';
import * as metaPixel from '@/lib/meta-pixel';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [showConfetti, setShowConfetti] = useState(false);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    // Lancer les confettis au chargement
    if (!showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#10b981'],
      });
    }
  }, [showConfetti]);

  // Track purchase
  useEffect(() => {
    if (orderId && !tracked) {
      setTracked(true);
      
      // Récupérer les détails de la commande pour analytics
      const trackPurchase = async () => {
        try {
          const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (order) {
            const orderItems = (order.items as Array<{
              product_id: string;
              product_name: string;
              quantity: number;
              price: number;
            }>).map(item => ({
              id: item.product_id,
              name: item.product_name,
              price: item.price,
              category: 'montessori',
              quantity: item.quantity,
            }));

            // Google Analytics
            analytics.purchase({
              transaction_id: order.id,
              value: order.total || 0,
              items: orderItems,
              shipping: order.total - order.subtotal || 0,
              discount: order.discount_amount || 0,
              promo_code: order.promo_code || undefined,
            });

            // Meta Pixel
            metaPixel.purchase({
              transactionId: order.id,
              total: order.total || 0,
              items: orderItems,
            });
          }
        } catch (error) {
          console.error('Error tracking purchase:', error);
        }
      };

      trackPurchase();
    }
  }, [orderId, tracked]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-14 h-14 text-emerald-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-stone-800 mb-4"
        >
          Paiement réussi ! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-stone-600 mb-6"
        >
          Merci pour votre commande ! Vous recevrez bientôt un email de confirmation.
        </motion.p>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-stone-50 rounded-xl p-4 mb-8"
          >
            <p className="text-sm text-stone-500">Numéro de commande</p>
            <p className="font-mono font-semibold text-stone-800">{orderId.slice(0, 8).toUpperCase()}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 text-left p-4 bg-amber-50 rounded-xl">
            <Package className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-stone-800">Livraison en cours de préparation</p>
              <p className="text-sm text-stone-500">Vous serez contacté pour la livraison</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Accueil
          </Link>
          <Link
            href="/produits"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Continuer les achats
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}


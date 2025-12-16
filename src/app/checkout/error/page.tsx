'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home, MessageCircle } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
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
          className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-14 h-14 text-red-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-stone-800 mb-4"
        >
          Paiement échoué
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-stone-600 mb-6"
        >
          Le paiement n&apos;a pas pu être effectué. Votre commande n&apos;a pas été débitée.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-50 rounded-xl p-4 mb-8 text-left"
        >
          <p className="font-medium text-stone-800 mb-2">Que faire ?</p>
          <ul className="text-sm text-stone-600 space-y-2">
            <li>• Vérifiez votre solde Wave/Orange Money</li>
            <li>• Assurez-vous d&apos;avoir une connexion stable</li>
            <li>• Réessayez avec un autre mode de paiement</li>
          </ul>
        </motion.div>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-stone-50 rounded-xl p-4 mb-8"
          >
            <p className="text-sm text-stone-500">Référence</p>
            <p className="font-mono font-semibold text-stone-800">{orderId.slice(0, 8).toUpperCase()}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/panier"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Accueil
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-stone-100"
        >
          <p className="text-sm text-stone-500 mb-3">Besoin d&apos;aide ?</p>
          <a
            href="https://wa.me/221711150763"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            Contactez-nous sur WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}


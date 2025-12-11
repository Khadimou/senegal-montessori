'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-200 rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-lg bg-amber-400/20"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-amber-700 text-sm font-medium shadow-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                Pédagogie Montessori au Sénégal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-800 leading-tight"
            >
              Éveillez le{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                potentiel
              </span>{' '}
              de votre enfant
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-stone-600 leading-relaxed max-w-xl"
            >
              Découvrez notre collection de jouets éducatifs Montessori, 
              soigneusement sélectionnés pour accompagner le développement 
              naturel de votre enfant.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/produits"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
              >
                Découvrir la boutique
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-700 rounded-2xl font-semibold hover:bg-stone-50 transition-all shadow-lg"
              >
                En savoir plus
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 pt-8 border-t border-stone-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Livraison gratuite</p>
                  <p className="text-sm text-stone-500">Partout au Sénégal dès 10,000 FCFA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Qualité garantie</p>
                  <p className="text-sm text-stone-500">Matériaux certifiés</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-200 to-amber-300 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=500&fit=crop"
                    alt="Jouets Montessori"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop"
                    alt="Matériel éducatif"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-rose-200 to-rose-300 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop"
                    alt="Apprentissage enfant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=500&fit=crop"
                    alt="Jouets en bois"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-orange-400 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-rose-400 border-2 border-white" />
                </div>
                <div>
                  <p className="font-bold text-stone-800">500+</p>
                  <p className="text-xs text-stone-500">Parents satisfaits</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


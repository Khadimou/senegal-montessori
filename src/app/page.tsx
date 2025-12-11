'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Heart, Users, Sparkles } from 'lucide-react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { useProductsStore } from '@/store/products';
import { categories } from '@/data/products';

export default function HomePage() {
  const { products, fetchProducts } = useProductsStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <Hero />

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-600 font-medium">Nos Catégories</span>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-stone-800">
              Explorez notre univers
            </h2>
            <p className="mt-4 text-xl text-stone-600 max-w-2xl mx-auto">
              Du matériel éducatif soigneusement sélectionné pour chaque domaine de développement
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/produits?categorie=${category.id}`}
                  className="group block relative aspect-[3/4] rounded-3xl overflow-hidden"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">{category.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <span className="text-amber-600 font-medium">Sélection</span>
              <h2 className="mt-2 text-4xl md:text-5xl font-bold text-stone-800">
                Produits populaires
              </h2>
              <p className="mt-4 text-xl text-stone-600 max-w-2xl">
                Les jouets préférés de nos clients
              </p>
            </div>
            <Link
              href="/produits"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors group"
            >
              Voir tous les produits
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Montessori */}
      <section className="py-24 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-200 font-medium">Pourquoi Montessori ?</span>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              Une pédagogie qui fait ses preuves
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Apprentissage autonome',
                description: 'L\'enfant apprend à son propre rythme, guidé par sa curiosité naturelle'
              },
              {
                icon: Heart,
                title: 'Développement global',
                description: 'Stimule tous les aspects : cognitif, émotionnel, social et physique'
              },
              {
                icon: Users,
                title: 'Respect de l\'enfant',
                description: 'Chaque enfant est unique et mérite un environnement adapté à ses besoins'
              },
              {
                icon: Sparkles,
                title: 'Créativité',
                description: 'Encourage l\'imagination et la pensée créative dès le plus jeune âge'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-amber-100">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Benefits Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: '🚚',
                title: 'Livraison gratuite',
                description: 'Partout au Sénégal dès 10,000 FCFA'
              },
              {
                icon: '🔒',
                title: 'Paiement sécurisé',
                description: 'Wave, Orange Money, Free Money, Banque'
              },
              {
                icon: '⭐',
                title: 'Qualité garantie',
                description: 'Matériaux certifiés et durables'
              },
              {
                icon: '💬',
                title: 'Support client',
                description: 'Assistance 7j/7 pour vos questions'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-stone-100"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] overflow-hidden bg-stone-900 text-white"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop"
                alt=""
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Prêt à commencer l&apos;aventure Montessori ?
              </h2>
              <p className="text-xl text-stone-300 mb-4 max-w-2xl mx-auto">
                Découvrez notre collection complète et offrez à votre enfant les outils pour grandir et s&apos;épanouir
              </p>
              <p className="text-lg text-amber-300 mb-8 font-semibold">
                🎁 Livraison gratuite partout au Sénégal dès 10,000 FCFA
              </p>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
              >
                Explorer la boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

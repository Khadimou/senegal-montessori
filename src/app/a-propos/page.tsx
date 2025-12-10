'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Target, Users, Award, ArrowRight, Quote } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Notre Histoire
            </h1>
            <p className="text-xl text-amber-100 leading-relaxed">
              Depuis 2020, nous accompagnons les familles sénégalaises dans leur découverte 
              de la pédagogie Montessori, en proposant du matériel éducatif de qualité 
              adapté à chaque étape du développement de l&apos;enfant.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <span className="text-amber-600 font-medium">Notre Mission</span>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-stone-800">
                  Rendre la pédagogie Montessori accessible à tous
                </h2>
              </div>
              <p className="text-lg text-stone-600 leading-relaxed">
                Nous croyons que chaque enfant possède un potentiel unique qui ne demande 
                qu&apos;à être révélé. Notre mission est de fournir aux parents et éducateurs 
                sénégalais les outils nécessaires pour accompagner ce développement naturel.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                En sélectionnant rigoureusement chaque produit de notre catalogue, nous 
                garantissons un matériel conforme aux principes Montessori, fabriqué avec 
                des matériaux naturels et durables.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-amber-700 font-bold">M</div>
                  <div className="w-12 h-12 rounded-full bg-orange-200 border-2 border-white flex items-center justify-center text-orange-700 font-bold">A</div>
                  <div className="w-12 h-12 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-rose-700 font-bold">K</div>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Fondée par des passionnés</p>
                  <p className="text-sm text-stone-500">Équipe 100% sénégalaise</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=750&fit=crop"
                  alt="Enfant apprenant avec du matériel Montessori"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl max-w-xs">
                <Quote className="w-8 h-8 text-amber-500 mb-3" />
                <p className="text-stone-600 italic">
                  &quot;L&apos;enfant n&apos;est pas un vase que l&apos;on remplit, mais une source que l&apos;on laisse jaillir.&quot;
                </p>
                <p className="mt-3 font-semibold text-stone-800">Maria Montessori</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-600 font-medium">Nos Valeurs</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-stone-800">
              Ce qui nous guide au quotidien
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Passion',
                description: 'Un amour profond pour l\'éducation et le développement de l\'enfant',
                color: 'rose'
              },
              {
                icon: Target,
                title: 'Qualité',
                description: 'Des produits soigneusement sélectionnés répondant aux normes les plus strictes',
                color: 'amber'
              },
              {
                icon: Users,
                title: 'Accompagnement',
                description: 'Un service client à l\'écoute pour vous guider dans vos choix',
                color: 'blue'
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'Une recherche constante d\'amélioration et d\'innovation',
                color: 'emerald'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-stone-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className={`w-16 h-16 bg-${value.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className={`w-8 h-8 text-${value.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">{value.title}</h3>
                <p className="text-stone-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '500+', label: 'Familles accompagnées' },
              { value: '50+', label: 'Produits disponibles' },
              { value: '4.9', label: 'Note moyenne' },
              { value: '100%', label: 'Satisfaction' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-stone-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-[2rem] p-8 md:p-16 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à découvrir notre univers ?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Explorez notre collection de jouets éducatifs et offrez à votre enfant 
              les meilleures conditions pour grandir et s&apos;épanouir.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 rounded-2xl font-semibold hover:bg-stone-100 transition-all"
              >
                Découvrir la boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white/10 transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


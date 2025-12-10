'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, TrendingUp, Gift, Users, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Invitation exclusive
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Construisons ensemble<br />
              <span className="text-amber-200">l&apos;avenir Montessori au Sénégal</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Une opportunité unique de rejoindre une aventure entrepreneuriale 
              alignée avec tes valeurs et ta passion pour la pédagogie Montessori.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Personal Message */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-stone-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-800">Un message personnel</h2>
                <p className="text-stone-500">De fondateur à future partenaire</p>
              </div>
            </div>
            
            <div className="prose prose-lg text-stone-600 space-y-4">
              <p>
                <strong className="text-stone-800">Salut !</strong> 👋
              </p>
              <p>
                Merci encore pour ton message d&apos;anniversaire la semaine dernière, 
                ça m&apos;a fait super plaisir ! 🎂
              </p>
              <p>
                Je te suis depuis un moment sur Instagram et j&apos;admire vraiment 
                la façon dont tu appliques la pédagogie Montessori avec ton fils. 
                Ton contenu est <strong>authentique, éducatif et inspirant</strong>.
              </p>
              <p>
                Je viens de lancer <strong>Montessori Sénégal</strong>, une boutique 
                en ligne de jouets éducatifs. Mon objectif ? Rendre le matériel 
                Montessori de qualité accessible aux familles sénégalaises.
              </p>
              <p>
                En créant ce projet, j&apos;ai tout de suite pensé à toi. Pas juste 
                comme &quot;influenceuse&quot;, mais comme <strong>partenaire</strong> qui 
                partage la même vision.
              </p>
              <p className="text-amber-600 font-medium">
                Est-ce que tu serais intéressée pour en discuter autour d&apos;un café ? ☕
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why You */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Pourquoi toi ? 🌟
            </h2>
            <p className="text-xl text-stone-600">
              Ce n&apos;est pas un hasard si je te contacte
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Authenticité',
                description: 'Tu vis la pédagogie Montessori au quotidien. Ce n\'est pas juste du contenu, c\'est ta vie.',
                color: 'rose'
              },
              {
                icon: Users,
                title: 'Confiance',
                description: 'Ta communauté te fait confiance parce que tu recommandes uniquement ce que tu utilises vraiment.',
                color: 'amber'
              },
              {
                icon: Star,
                title: 'Expertise',
                description: 'Tu comprends les besoins des mamans sénégalaises et tu sais leur parler.',
                color: 'orange'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className={`w-16 h-16 bg-${item.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's In It For You */}
      <section className="py-16 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que tu y gagnes 🎁
            </h2>
            <p className="text-xl text-stone-400">
              Un partenariat gagnant-gagnant
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Commission attractive',
                description: '15% sur chaque vente générée par ton code promo personnel',
                highlight: '15%'
              },
              {
                icon: Gift,
                title: 'Produits offerts',
                description: 'Reçois les nouveautés gratuitement pour les tester avec ton fils',
                highlight: 'Gratuit'
              },
              {
                icon: Star,
                title: 'Statut exclusif',
                description: '"Experte Pédagogique" - Un titre qui valorise ton expertise',
                highlight: 'VIP'
              },
              {
                icon: Users,
                title: 'Communauté',
                description: 'Accès privilégié à notre groupe de mamans Montessori',
                highlight: 'Réseau'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 flex gap-4"
              >
                <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <span className="px-2 py-0.5 bg-amber-500/30 text-amber-300 text-xs font-bold rounded-full">
                      {item.highlight}
                    </span>
                  </div>
                  <p className="text-stone-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Comment ça marche ? 🚀
            </h2>
            <p className="text-xl text-stone-600">
              Simple, transparent, sans pression
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'On discute',
                description: 'Un café ensemble pour faire connaissance et répondre à tes questions. Zéro engagement.'
              },
              {
                step: '2',
                title: 'Tu testes',
                description: 'Tu reçois des produits chez toi. Tu les essaies avec ton fils en toute liberté.'
              },
              {
                step: '3',
                title: 'Tu partages (si tu veux)',
                description: 'Si tu aimes, tu en parles naturellement à ta communauté. Avec ton code promo exclusif.'
              },
              {
                step: '4',
                title: 'Tu gagnes',
                description: 'Commission sur chaque vente + nouveautés offertes + on construit ensemble.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex-1">
                  <h3 className="font-semibold text-lg text-stone-800 mb-1">{item.title}</h3>
                  <p className="text-stone-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* No Pressure */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-amber-100 text-center"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
              Zéro pression, zéro obligation
            </h2>
            <p className="text-lg text-stone-600 mb-6">
              Je ne te demande pas de répondre maintenant. Prends le temps de visiter 
              la boutique, de réfléchir, et on en reparle quand tu veux.
            </p>
            <p className="text-stone-500">
              Même si tu n&apos;es pas intéressée, ton avis de maman Montessori 
              m&apos;intéresse vraiment. 🙏
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Alors, on en discute ? ☕
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Réponds-moi sur Instagram ou WhatsApp.<br />
              J&apos;ai hâte d&apos;avoir ton avis !
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 rounded-2xl font-semibold hover:bg-stone-100 transition-all"
              >
                Découvrir la boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/221771234567?text=Hello%20!%20J'ai%20vu%20ta%20proposition%20de%20partenariat%20🌟"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-semibold hover:bg-emerald-600 transition-all"
              >
                💬 WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


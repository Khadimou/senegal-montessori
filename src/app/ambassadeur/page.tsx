'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Camera, Users, CheckCircle, Send, Instagram, Facebook, Sparkles, Heart, Trophy } from 'lucide-react';
import * as metaPixel from '@/lib/meta-pixel';

const MAX_AMBASSADORS = 5;

export default function AmbassadeurPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', city: '', instagram: '', facebook: '', children_ages: '', motivation: '', social_followers: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    fetch('/api/ambassadeur?count=true').then(r => r.json()).then(data => {
      const remaining = MAX_AMBASSADORS - (data.count || 0);
      setSpotsLeft(remaining);
      if (remaining <= 0) setIsClosed(true);
    }).catch(() => setSpotsLeft(MAX_AMBASSADORS));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/ambassadeur', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur');
      metaPixel.customEvent('AmbassadorApplication');
      setIsSubmitted(true);
      if (spotsLeft) setSpotsLeft(spotsLeft - 1);
    } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    finally { setIsSubmitting(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const benefits = [
    { icon: Gift, title: 'Jouet offert', desc: 'Recevez un jouet de 15 000 FCFA', color: 'bg-amber-100 text-amber-600' },
    { icon: Star, title: 'Statut VIP', desc: 'Acces exclusif aux nouveautes', color: 'bg-purple-100 text-purple-600' },
    { icon: Users, title: 'Communaute', desc: 'Rejoignez un reseau de parents', color: 'bg-blue-100 text-blue-600' },
    { icon: Trophy, title: 'Reconnaissance', desc: 'Temoignage mis en avant', color: 'bg-emerald-100 text-emerald-600' }
  ];

  const requirements = ['Avoir un enfant de 0 a 8 ans', 'Etre actif sur Instagram ou Facebook', 'Partager 1 video + 2-3 photos', 'Rediger un temoignage honnete', "Autoriser l'utilisation du contenu"];

  const getSpotsBgClass = () => {
    if (isClosed) return 'bg-red-500/20 border border-red-300';
    if (spotsLeft !== null && spotsLeft <= 2) return 'bg-orange-500/20 border border-orange-300 animate-pulse';
    return 'bg-white/20 border border-white/30';
  };

  const getSpotsTextClass = () => isClosed ? 'text-red-200' : '';

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-amber-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"><div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" /><div className="absolute bottom-10 right-10 w-60 h-60 bg-amber-300 rounded-full blur-3xl" /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6"><Sparkles className="w-4 h-4" />Programme exclusif - Places limitees</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Devenez Ambassadeur</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">Rejoignez notre famille et recevez un jouet Montessori gratuit en echange de votre temoignage</p>
            {spotsLeft !== null && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${getSpotsBgClass()}`}>
                <div className={`text-4xl font-bold ${getSpotsTextClass()}`}>{isClosed ? '0' : spotsLeft}</div>
                <div className="text-left"><p className="font-semibold">{isClosed ? 'Places epuisees' : 'Places restantes'}</p><p className="text-sm text-purple-200">sur {MAX_AMBASSADORS} au total</p></div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h2 className="text-3xl font-bold text-stone-800 text-center mb-4">Ce que vous recevez</h2>
          <p className="text-stone-600 text-center mb-10 max-w-2xl mx-auto">En tant qu&apos;ambassadeur, vous beneficiez d&apos;avantages exclusifs</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${b.color} rounded-xl flex items-center justify-center mx-auto mb-4`}><b.icon className="w-7 h-7" /></div>
                <h3 className="font-bold text-stone-800 mb-2">{b.title}</h3><p className="text-sm text-stone-600">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3"><Camera className="w-7 h-7 text-purple-600" />Ce qu&apos;on attend de vous</h2>
              <ul className="space-y-4">{requirements.map((r, i) => (<li key={i} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span className="text-stone-700">{r}</span></li>))}</ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-3 mb-4"><Heart className="w-6 h-6 text-red-500" /><h3 className="font-bold text-stone-800">Pourquoi ce programme ?</h3></div>
              <p className="text-stone-600 text-sm leading-relaxed">Les temoignages authentiques aident d&apos;autres parents a decouvrir la pedagogie Montessori.</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-3"><Gift className="w-6 h-6 text-purple-600" /><h3 className="font-bold text-stone-800">Valeur du cadeau</h3></div>
              <p className="text-3xl font-bold text-purple-600 mb-2">15 000 FCFA</p><p className="text-stone-600 text-sm">Jouet Montessori de votre choix</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Candidature Ambassadeur</h2>
              <p className="text-stone-600 mb-6">Remplissez le formulaire pour postuler</p>
              {isClosed ? (
                <div className="text-center py-12"><div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-10 h-10 text-stone-400" /></div><h3 className="text-2xl font-bold text-stone-800 mb-2">Places epuisees</h3><p className="text-stone-600 mb-6">Contactez-nous pour la prochaine session.</p><a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors">Nous contacter</a></div>
              ) : isSubmitted ? (
                <div className="text-center py-12"><div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="w-10 h-10 text-emerald-500" /></div><h3 className="text-2xl font-bold text-stone-800 mb-2">Candidature envoyee !</h3><p className="text-stone-600 mb-6">Nous vous contacterons dans les 48h.</p></div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Nom complet *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Votre nom" /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="votre@email.com" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Telephone WhatsApp *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="+221 77 XXX XX XX" /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Ville *</label><select name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="">Selectionnez</option><option value="Dakar">Dakar</option><option value="Thies">Thies</option><option value="Saint-Louis">Saint-Louis</option><option value="Mbour">Mbour</option><option value="Autre">Autre</option></select></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2"><Instagram className="w-4 h-4 inline mr-1" />Instagram</label><input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="@votre_compte" /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2"><Facebook className="w-4 h-4 inline mr-1" />Facebook</label><input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Lien profil" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Age(s) de vos enfants *</label><input type="text" name="children_ages" value={formData.children_ages} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ex: 2 ans, 5 ans" /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-2">Nombre d&apos;abonnes</label><select name="social_followers" value={formData.social_followers} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="">Selectionnez</option><option value="0-100">Moins de 100</option><option value="100-500">100-500</option><option value="500-1000">500-1000</option><option value="1000+">Plus de 1000</option></select></div>
                  </div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-2">Pourquoi devenir ambassadeur ? *</label><textarea name="motivation" value={formData.motivation} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" placeholder="Parlez-nous de vous..." /></div>
                  {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
                  <p className="text-xs text-stone-500">En soumettant, vous autorisez l&apos;utilisation de vos contenus a des fins promotionnelles.</p>
                  <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50">{isSubmitting ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Envoi...</>) : (<><Send className="w-5 h-5" />Envoyer ma candidature</>)}</button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


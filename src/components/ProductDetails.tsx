'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RotateCcw, Check, Minus, Plus, Clock, Mail, Phone, User, X, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { Product } from '@/types';
import ImageGallery from '@/components/ImageGallery';
import ProductCard from '@/components/ProductCard';
import * as analytics from '@/lib/analytics';
import * as metaPixel from '@/lib/meta-pixel';

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  // États pour la demande de précommande
  const [showPreorderForm, setShowPreorderForm] = useState(false);
  const [preorderSubmitting, setPreorderSubmitting] = useState(false);
  const [preorderSuccess, setPreorderSuccess] = useState(false);
  const [preorderData, setPreorderData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track product view (Google Analytics + Meta Pixel)
  useEffect(() => {
    if (mounted && product) {
      // Google Analytics
      analytics.viewProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      });
      // Meta Pixel
      metaPixel.viewContent({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      });
    }
  }, [mounted, product]);

  const handleAddToCart = () => {
    if (!product.inStock) {
      setShowPreorderForm(true);
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    openCart();
  };

  const handlePreorderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreorderSubmitting(true);

    try {
      const response = await fetch('/api/preorder-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.name,
          customer_name: preorderData.name,
          customer_email: preorderData.email,
          customer_phone: preorderData.phone,
          quantity_requested: quantity,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la demande');

      // Analytics: track preorder request (Google Analytics + Meta Pixel)
      analytics.preorderRequest({
        id: product.id,
        name: product.name,
        quantity: quantity,
      });
      metaPixel.lead({
        productId: product.id,
        productName: product.name,
        value: product.price * quantity,
      });

      setPreorderSuccess(true);
      setPreorderData({ name: '', email: '', phone: '' });
      setQuantity(1);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setPreorderSubmitting(false);
    }
  };

  // Utiliser images si disponible, sinon fallback sur image
  const productImages = product.images?.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la boutique
          </Link>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <ImageGallery images={productImages} alt={product.name} />
            {!product.inStock && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-stone-800 text-white font-medium rounded-xl">
                Rupture de stock
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-amber-600 font-medium uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-stone-800">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-amber-600">
                {formatPrice(product.price)}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                {product.ageRange}
              </span>
            </div>

            <p className="mt-6 text-lg text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mt-8">
              <h3 className="font-semibold text-stone-800 mb-4">Caractéristiques</h3>
              <ul className="grid grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-stone-600">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Info liste d'attente si rupture */}
            {!product.inStock && !showPreorderForm && !preorderSuccess && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800">Produit en rupture de stock</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Ce produit est actuellement indisponible. Manifestez votre intérêt et nous vous contacterons dès qu&apos;il sera de nouveau disponible.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire de demande */}
            {!product.inStock && showPreorderForm && !preorderSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-6 bg-white border-2 border-amber-200 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-stone-800">Manifester mon intérêt</h3>
                  <button
                    onClick={() => setShowPreorderForm(false)}
                    className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>
                
                <form onSubmit={handlePreorderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={preorderData.name}
                        onChange={(e) => setPreorderData({ ...preorderData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={preorderData.email}
                        onChange={(e) => setPreorderData({ ...preorderData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="tel"
                        value={preorderData.phone}
                        onChange={(e) => setPreorderData({ ...preorderData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="+221 77 XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Quantité souhaitée: {quantity}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                      >
                        <Minus className="w-5 h-5 text-stone-600" />
                      </button>
                      <span className="flex-1 text-center font-semibold text-xl">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                      >
                        <Plus className="w-5 h-5 text-stone-600" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={preorderSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
                  >
                    {preorderSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Message de succès */}
            {!product.inStock && preorderSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center"
              >
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-emerald-800 mb-2">Demande enregistrée !</h3>
                <p className="text-sm text-emerald-700">
                  Nous vous contacterons dès que ce produit sera disponible.
                </p>
                <button
                  onClick={() => setPreorderSuccess(false)}
                  className="mt-4 text-sm text-emerald-700 hover:text-emerald-800 underline"
                >
                  Faire une autre demande
                </button>
              </motion.div>
            )}

            {/* Stock disponible */}
            {product.inStock && product.stockQuantity !== undefined && product.stockQuantity > 0 && (
              <div className="mt-6">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  product.stockQuantity <= 3 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {product.stockQuantity <= 3 
                    ? `⚠️ Plus que ${product.stockQuantity} en stock` 
                    : `✓ ${product.stockQuantity} en stock`
                  }
                </span>
              </div>
            )}

            {/* Quantity & Add to Cart - Visible seulement si pas de formulaire affiché */}
            {(!showPreorderForm || product.inStock) && !preorderSuccess && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {product.inStock && (
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-stone-200 px-4 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-5 h-5 text-stone-600" />
                    </button>
                    <span className="w-12 text-center font-semibold text-stone-800 text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                    product.inStock 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-purple-500/25'
                  }`}
                >
                  {product.inStock ? (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5" />
                      Manifester mon intérêt
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-stone-100">
                <Truck className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs text-stone-600">Livraison Dakar</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-stone-100">
                <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs text-stone-600">Qualité garantie</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-stone-100">
                <RotateCcw className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs text-stone-600">Retour 14 jours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-8">
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

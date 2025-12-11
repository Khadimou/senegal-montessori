'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  LogOut, 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Search,
  AlertCircle,
  Save,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  GripVertical,
  ShoppingCart,
  Eye,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminStore } from '@/store/admin';
import { useProductsStore } from '@/store/products';
import { useOrdersStore } from '@/store/orders';
import { useFinancesStore } from '@/store/finances';
import { categories, formatPrice } from '@/data/products';
import { Product, Order, OrderStatus, Expense, ExpenseCategory } from '@/types';

// Composant Login
function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAdminStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Administration</h1>
          <p className="text-stone-500 mt-2">Connectez-vous pour gérer la boutique</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Mot de passe incorrect</span>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Se connecter
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Composant pour gérer les images multiples
function MultiImageInput({ 
  images, 
  onChange 
}: { 
  images: string[]; 
  onChange: (images: string[]) => void;
}) {
  const [newImageUrl, setNewImageUrl] = useState('');

  const addImage = () => {
    if (newImageUrl.trim()) {
      onChange([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-stone-700">
        Images du produit *
      </label>
      
      {/* Liste des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden bg-stone-100 border-2 border-stone-200"
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><rect width="24" height="24"/></svg>';
                }}
              />
              
              {/* Badge première image */}
              {index === 0 && (
                <span className="absolute top-1 left-1 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded">
                  Principale
                </span>
              )}
              
              {/* Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 0)}
                    className="p-1.5 bg-white rounded-lg text-stone-700 hover:bg-amber-100"
                    title="Définir comme principale"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-white rounded-lg text-red-500 hover:bg-red-100"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Ajouter une image */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
          className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="https://images.unsplash.com/..."
        />
        <button
          type="button"
          onClick={addImage}
          disabled={!newImageUrl.trim()}
          className="px-4 py-3 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>
      
      <p className="text-xs text-stone-500">
        💡 La première image sera l&apos;image principale du produit. Glissez pour réorganiser.
      </p>
    </div>
  );
}

// Formulaire d'ajout/édition de produit
function ProductForm({ 
  product, 
  onSave, 
  onCancel,
  isLoading
}: { 
  product?: Product; 
  onSave: (data: Omit<Product, 'id' | 'image'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    images: product?.images?.length ? product.images : (product?.image ? [product.image] : []),
    category: product?.category || categories[0].id,
    ageRange: product?.ageRange || '3-6 ans',
    inStock: product?.inStock ?? true,
    features: product?.features?.join(', ') || '',
    // Champs financiers
    costPrice: product?.costPrice || 0,
    stockQuantity: product?.stockQuantity || 0,
    minStockAlert: product?.minStockAlert || 5,
    supplier: product?.supplier || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Veuillez ajouter au moins une image');
      return;
    }
    onSave({
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      images: formData.images,
      category: formData.category,
      ageRange: formData.ageRange,
      inStock: formData.inStock,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      // Champs financiers
      costPrice: Number(formData.costPrice),
      stockQuantity: Number(formData.stockQuantity),
      minStockAlert: Number(formData.minStockAlert),
      supplier: formData.supplier || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Tour Rose Montessori"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="35000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Tranche d&apos;âge *
              </label>
              <input
                type="text"
                required
                value={formData.ageRange}
                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="3-6 ans"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                En stock
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-colors ${
                  formData.inStock
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-stone-50 border-stone-300 text-stone-500'
                }`}
              >
                {formData.inStock ? '✓ En stock' : '✗ Rupture de stock'}
              </button>
            </div>

            {/* Séparateur Section Finances */}
            <div className="md:col-span-2 border-t border-stone-200 pt-4 mt-2">
              <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4" />
                Informations financières
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Prix d&apos;achat (FCFA)
              </label>
              <input
                type="number"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="25000"
              />
              <p className="text-xs text-stone-500 mt-1">Coût d&apos;achat ou de fabrication</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Quantité en stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Seuil d&apos;alerte stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.minStockAlert}
                onChange={(e) => setFormData({ ...formData, minStockAlert: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="5"
              />
              <p className="text-xs text-stone-500 mt-1">Alerte quand le stock descend en dessous</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Fournisseur
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Nom du fournisseur"
              />
            </div>

            {/* Multi-image input */}
            <div className="md:col-span-2">
              <MultiImageInput
                images={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                placeholder="Description détaillée du produit..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Caractéristiques (séparées par des virgules)
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Bois naturel, Peinture non toxique, 10 pièces"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {product ? 'Enregistrer' : 'Ajouter'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Composant pour afficher les détails d'une commande
function OrderDetailsModal({ 
  order, 
  onClose, 
  onUpdateStatus 
}: { 
  order: Order; 
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;
    setIsUpdating(true);
    await onUpdateStatus(order.id, selectedStatus);
    setIsUpdating(false);
  };

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">Détails de la commande</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations client */}
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-3">Informations client</h3>
            <div className="bg-stone-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-400" />
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400" />
                <span>{order.customer_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400" />
                <span>{order.customer_phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-400 mt-0.5" />
                <span>{order.customer_address}</span>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-3">Articles commandés</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="bg-stone-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-800">{item.product_name}</p>
                    <p className="text-sm text-stone-500">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-amber-600">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Informations de paiement */}
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-3">Paiement</h3>
            <div className="bg-stone-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-stone-400" />
                  <span>Méthode de paiement</span>
                </div>
                <span className="font-medium">{order.payment_method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Statut du paiement</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.payment_status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                  order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.payment_status === 'done' ? 'Payé' :
                   order.payment_status === 'failed' ? 'Échoué' :
                   'En attente'}
                </span>
              </div>
              {order.naboopay_transaction_id && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">Transaction ID</span>
                  <span className="text-sm font-mono text-stone-600">{order.naboopay_transaction_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statut de la commande */}
          <div>
            <h3 className="text-sm font-semibold text-stone-600 mb-3">Statut de la commande</h3>
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={selectedStatus === order.status || isUpdating}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mettre à jour'}
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <span className="text-lg font-bold text-stone-800">Total</span>
            <span className="text-2xl font-bold text-amber-600">{formatPrice(order.total)}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Calendar className="w-4 h-4" />
            <span>Commande créée le {new Date(order.created_at).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Composant pour gérer les commandes
function OrdersManagement() {
  const { orders, isLoading, error, fetchOrders, updateOrderStatus } = useOrdersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Total</p>
          <p className="text-3xl font-bold text-stone-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">En attente</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Confirmées</p>
          <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Expédiées</p>
          <p className="text-3xl font-bold text-purple-600">{stats.shipped}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Livrées</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Annulées</p>
          <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => fetchOrders()}
          className="px-4 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Orders List */}
      {isLoading && orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-stone-500">Chargement des commandes...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Articles</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Statut</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Paiement</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-stone-500">{order.id.slice(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-stone-800">{order.customer_name}</p>
                        <p className="text-sm text-stone-500">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">{order.items.length} article(s)</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-600">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.payment_status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                        order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.payment_status === 'done' ? 'Payé' :
                         order.payment_status === 'failed' ? 'Échoué' :
                         'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Aucune commande trouvée</p>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={async (id, status) => {
              await updateOrderStatus(id, status);
              setSelectedOrder({ ...selectedOrder, status });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant pour gérer les finances
function FinancesManagement() {
  const { products } = useProductsStore();
  const { orders } = useOrdersStore();
  const { 
    expenses, 
    stats, 
    isLoading, 
    error, 
    fetchExpenses, 
    addExpense, 
    deleteExpense,
    calculateStats 
  } = useFinancesStore();
  
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'expenses' | 'stock' | 'profitability'>('overview');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    if (orders.length > 0 || products.length > 0) {
      calculateStats(orders, products);
    }
  }, [orders, products, expenses, calculateStats]);

  const categoryLabels: Record<ExpenseCategory, string> = {
    stock: 'Achat de stock',
    marketing: 'Marketing',
    transport: 'Transport',
    autres: 'Autres',
  };

  const categoryColors: Record<ExpenseCategory, string> = {
    stock: 'bg-blue-100 text-blue-700',
    marketing: 'bg-purple-100 text-purple-700',
    transport: 'bg-orange-100 text-orange-700',
    autres: 'bg-stone-100 text-stone-700',
  };

  // Calcul de la rentabilité par produit
  const productProfitability = products.map(product => {
    const soldQuantity = product.totalSold || 0;
    const revenue = soldQuantity * product.price;
    const cost = soldQuantity * (product.costPrice || 0);
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    return {
      id: product.id,
      name: product.name,
      costPrice: product.costPrice || 0,
      salePrice: product.price,
      stockQuantity: product.stockQuantity || 0,
      soldQuantity,
      revenue,
      cost,
      profit,
      margin,
    };
  }).sort((a, b) => b.profit - a.profit);

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: PieChart },
          { id: 'expenses', label: 'Dépenses', icon: Receipt },
          { id: 'stock', label: 'Stock & Coûts', icon: Package },
          { id: 'profitability', label: 'Rentabilité', icon: TrendingUp },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-amber-100 text-amber-700'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* KPIs principaux */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-sm text-stone-500">Chiffre d'affaires</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatPrice(stats?.totalRevenue || 0)}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm text-stone-500">Dépenses totales</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{formatPrice(stats?.totalExpenses || 0)}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm text-stone-500">Bénéfice net</p>
              </div>
              <p className={`text-2xl font-bold ${(stats?.totalProfit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatPrice(stats?.totalProfit || 0)}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-stone-500">Marge bénéficiaire</p>
              </div>
              <p className={`text-2xl font-bold ${(stats?.profitMargin || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {(stats?.profitMargin || 0).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Statistiques secondaires */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Produits les plus vendus */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                Top 5 des ventes
              </h3>
              {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.topSellingProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-stone-700 text-sm">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-amber-600">{product.totalSold} vendus</p>
                        <p className="text-xs text-stone-500">{formatPrice(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-center py-4">Aucune vente enregistrée</p>
              )}
            </div>

            {/* Alertes stock bas */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Alertes de stock
              </h3>
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                      <span className="text-stone-700 text-sm">{product.name}</span>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{product.stockQuantity} en stock</p>
                        <p className="text-xs text-stone-500">Seuil: {product.minStockAlert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-600 text-center py-4">✓ Tous les stocks sont suffisants</p>
              )}
            </div>
          </div>

          {/* Répartition des dépenses */}
          {stats?.expensesByCategory && stats.expensesByCategory.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-amber-500" />
                Répartition des dépenses
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.expensesByCategory.map((cat) => (
                  <div key={cat.category} className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${categoryColors[cat.category]} mb-2`}>
                      <Receipt className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-stone-800">{formatPrice(cat.amount)}</p>
                    <p className="text-sm text-stone-500">{categoryLabels[cat.category]}</p>
                    <p className="text-xs text-stone-400">{cat.percentage.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gestion des dépenses */}
      {activeSection === 'expenses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-stone-800">Historique des dépenses</h3>
            <button
              onClick={() => setShowExpenseForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              <Plus className="w-5 h-5" />
              Nouvelle dépense
            </button>
          </div>

          {isLoading && expenses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-stone-500">Chargement des dépenses...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Catégorie</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Description</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Produit</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Montant</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-stone-600">
                          {new Date(expense.expense_date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[expense.category]}`}>
                            {categoryLabels[expense.category]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-700">{expense.description}</td>
                        <td className="px-6 py-4 text-sm text-stone-500">
                          {expense.product_name || '-'}
                          {expense.quantity ? ` (×${expense.quantity})` : ''}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-red-600">
                          -{formatPrice(expense.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {expenses.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500">Aucune dépense enregistrée</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stock & Coûts */}
      {activeSection === 'stock' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-stone-800">Gestion du stock et des coûts</h3>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Produit</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Prix d'achat</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Prix de vente</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Marge unitaire</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Stock</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Valeur stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {productProfitability.map((product) => {
                    const unitMargin = product.salePrice - product.costPrice;
                    const unitMarginPercent = product.salePrice > 0 ? (unitMargin / product.salePrice) * 100 : 0;
                    const stockValue = product.stockQuantity * product.costPrice;
                    
                    return (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-stone-800">{product.name}</p>
                        </td>
                        <td className="px-6 py-4 text-right text-stone-600">
                          {product.costPrice > 0 ? formatPrice(product.costPrice) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-amber-600">
                          {formatPrice(product.salePrice)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {product.costPrice > 0 ? (
                            <div>
                              <p className="font-medium text-emerald-600">{formatPrice(unitMargin)}</p>
                              <p className="text-xs text-stone-500">{unitMarginPercent.toFixed(1)}%</p>
                            </div>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.stockQuantity <= 5 
                              ? 'bg-red-100 text-red-700' 
                              : product.stockQuantity <= 10 
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-stone-700">
                          {product.costPrice > 0 ? formatPrice(stockValue) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>💡 Astuce :</strong> Pour modifier le prix d'achat ou le stock d'un produit, 
              allez dans l'onglet "Produits" et modifiez le produit concerné.
            </p>
          </div>
        </div>
      )}

      {/* Rentabilité */}
      {activeSection === 'profitability' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-stone-800">Analyse de rentabilité par produit</h3>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Produit</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Vendus</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Revenus</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Coûts</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Profit</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Marge</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-stone-600">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {productProfitability.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-stone-800">{product.name}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-stone-600">
                        {product.soldQuantity}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600">
                        {formatPrice(product.revenue)}
                      </td>
                      <td className="px-6 py-4 text-right text-red-600">
                        {formatPrice(product.cost)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${product.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {product.profit >= 0 ? '+' : ''}{formatPrice(product.profit)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-medium ${product.margin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {product.margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.soldQuantity === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                            Pas de ventes
                          </span>
                        ) : product.margin >= 30 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            <ArrowUpRight className="w-3 h-3" />
                            Rentable
                          </span>
                        ) : product.margin >= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            À surveiller
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            <ArrowDownRight className="w-3 h-3" />
                            Déficitaire
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de dépense */}
      <AnimatePresence>
        {showExpenseForm && (
          <ExpenseFormModal
            products={products}
            onSave={async (data) => {
              await addExpense(data);
              setShowExpenseForm(false);
            }}
            onClose={() => setShowExpenseForm(false)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal pour ajouter une dépense
function ExpenseFormModal({
  products,
  onSave,
  onClose,
  isLoading,
}: {
  products: Product[];
  onSave: (data: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    category: 'stock' as ExpenseCategory,
    description: '',
    amount: 0,
    quantity: 0,
    product_id: '',
    supplier: '',
    expense_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      quantity: formData.category === 'stock' ? Number(formData.quantity) : undefined,
      product_id: formData.category === 'stock' ? formData.product_id || undefined : undefined,
      supplier: formData.supplier || undefined,
      expense_date: formData.expense_date,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">Nouvelle dépense</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Catégorie *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="stock">Achat de stock</option>
              <option value="marketing">Marketing</option>
              <option value="transport">Transport</option>
              <option value="autres">Autres</option>
            </select>
          </div>

          {formData.category === 'stock' && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Produit</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Quantité achetée</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="10"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Description *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Achat de 10 tours roses chez Fournisseur X"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Montant (FCFA) *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Fournisseur</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Nom du fournisseur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Dashboard Admin
function AdminDashboard() {
  const { logout } = useAdminStore();
  const { products, isLoading, error, fetchProducts, addProduct, updateProduct, deleteProduct, updateStock } = useProductsStore();
  const { fetchOrders } = useOrdersStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'finances'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (data: Omit<Product, 'id' | 'image'>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
  };

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-stone-800">Administration</h1>
                <p className="text-xs text-stone-500">Gestion des produits • Supabase</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchProducts()}
                className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Rafraîchir"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'products'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produits
            </div>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Commandes
            </div>
          </button>
          <button
            onClick={() => setActiveTab('finances')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'finances'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Finances
            </div>
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-stone-500">Total produits</p>
                <p className="text-3xl font-bold text-stone-800">{stats.total}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-stone-500">En stock</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.inStock}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm text-stone-500">Rupture</p>
                <p className="text-3xl font-bold text-red-500">{stats.outOfStock}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={() => {
                  setEditingProduct(undefined);
                  setShowForm(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter un produit
              </button>
            </div>

            {/* Loading State */}
            {isLoading && products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                <p className="text-stone-500">Chargement des produits...</p>
              </div>
            ) : (
              /* Products List */
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Produit</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Catégorie</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Prix</th>
                        <th className="text-center px-6 py-4 text-sm font-semibold text-stone-600">Images</th>
                        <th className="text-center px-6 py-4 text-sm font-semibold text-stone-600">Stock</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-stone-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                                {(product.images?.[0] || product.image) ? (
                                  <img
                                    src={product.images?.[0] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    <Package className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-stone-800">{product.name}</p>
                                <p className="text-sm text-stone-500">{product.ageRange}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-full">
                              {categories.find((c) => c.id === product.category)?.name || product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-amber-600">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                              <ImageIcon className="w-4 h-4" />
                              {product.images?.length || 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => updateStock(product.id, !product.inStock)}
                              className={`mx-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                product.inStock
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {product.inStock ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  En stock
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4" />
                                  Rupture
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              {deleteConfirm === product.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                    title="Confirmer"
                                  >
                                    <Check className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                                    title="Annuler"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(product.id)}
                                  className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">Aucun produit trouvé</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && <OrdersManagement />}

        {/* Finances Tab */}
        {activeTab === 'finances' && <FinancesManagement />}
      </main>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(undefined);
            }}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Page principale
export default function AdminPage() {
  const { isAuthenticated } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <LoginForm />;
}

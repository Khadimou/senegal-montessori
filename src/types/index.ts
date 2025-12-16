export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];  // Plusieurs images maintenant
  image: string;     // Image principale (première de la liste)
  category: string;
  ageRange: string;
  inStock: boolean;
  features: string[];
  // Champs financiers
  costPrice?: number;        // Prix d'achat/coût
  stockQuantity?: number;    // Quantité en stock
  minStockAlert?: number;    // Seuil d'alerte stock
  supplier?: string;         // Fournisseur
  totalSold?: number;        // Total vendu
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'done' | 'failed';

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment_method: string;
  payment_status?: PaymentStatus;
  naboopay_transaction_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Types pour la gestion financière
export type ExpenseCategory = 'stock' | 'marketing' | 'transport' | 'autres';

export interface Expense {
  id: string;
  product_id?: string;
  product_name?: string;  // Pour l'affichage
  category: ExpenseCategory;
  description: string;
  amount: number;
  quantity?: number;
  supplier?: string;
  receipt_url?: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  goal_type: 'revenue' | 'profit' | 'savings';
  period: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialStats {
  totalRevenue: number;         // Chiffre d'affaires total
  totalExpenses: number;        // Total des dépenses
  totalProfit: number;          // Bénéfice net
  profitMargin: number;         // Marge bénéficiaire (%)
  totalOrders: number;          // Nombre de commandes
  averageOrderValue: number;    // Valeur moyenne des commandes
  topSellingProducts: Array<{
    id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stockQuantity: number;
    minStockAlert: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  expensesByCategory: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
}

// Types pour les codes promo
export type DiscountType = 'percentage' | 'fixed';

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;          // Pourcentage ou montant fixe
  min_order_amount: number;        // Montant minimum de commande
  max_discount?: number;           // Plafond de réduction (pour les %)
  usage_limit?: number;            // Limite d'utilisation
  usage_count: number;             // Utilisations actuelles
  starts_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromoCodeValidation {
  is_valid: boolean;
  error_message?: string;
  promo_id?: string;
  discount_type?: DiscountType;
  discount_value?: number;
  max_discount?: number;
  calculated_discount?: number;
}

// Demandes de précommande
export type PreorderRequestStatus = 'pending' | 'contacted' | 'converted' | 'cancelled';

export interface PreorderRequest {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  quantity_requested: number;
  status: PreorderRequestStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
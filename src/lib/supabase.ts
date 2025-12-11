import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];  // Array d'images
  category: string;
  age_range: string;
  in_stock: boolean;
  features: string[];
  // Champs financiers
  cost_price?: number;
  stock_quantity?: number;
  min_stock_alert?: number;
  supplier?: string;
  total_sold?: number;
  created_at: string;
  updated_at: string;
}

export interface DbExpense {
  id: string;
  product_id?: string;
  category: string;
  description: string;
  amount: number;
  quantity?: number;
  supplier?: string;
  receipt_url?: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface DbFinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  goal_type: string;
  period: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status?: 'pending' | 'done' | 'failed';
  naboopay_transaction_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

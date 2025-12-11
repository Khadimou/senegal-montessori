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
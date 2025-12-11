import { create } from 'zustand';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { supabase, DbOrder } from '@/lib/supabase';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) => Promise<void>;
  updateOrderNotes: (id: string, notes: string) => Promise<void>;
}

// Convertir du format DB vers le format App
const dbToOrder = (db: DbOrder): Order => ({
  id: db.id,
  customer_name: db.customer_name,
  customer_email: db.customer_email,
  customer_phone: db.customer_phone,
  customer_address: db.customer_address,
  items: db.items,
  total: db.total,
  status: db.status,
  payment_method: db.payment_method,
  payment_status: db.payment_status || 'pending',
  naboopay_transaction_id: db.naboopay_transaction_id,
  notes: db.notes,
  created_at: db.created_at,
  updated_at: db.updated_at,
});

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  lastFetch: null,

  fetchOrders: async () => {
    // Éviter les appels multiples en parallèle
    if (get().isLoading) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        set({ 
          orders: [], 
          isLoading: false,
          error: 'Erreur lors du chargement des commandes',
          lastFetch: Date.now()
        });
        return;
      }

      if (data && data.length > 0) {
        const orders = data.map(dbToOrder);
        set({ orders, isLoading: false, lastFetch: Date.now() });
      } else {
        set({ 
          orders: [], 
          isLoading: false,
          lastFetch: Date.now()
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      set({ 
        orders: [], 
        isLoading: false,
        error: 'Erreur lors du chargement des commandes',
        lastFetch: Date.now()
      });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      set({ error: 'Erreur lors de la mise à jour du statut', isLoading: false });
    }
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, payment_status: paymentStatus } : order
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de paiement:', error);
      set({ error: 'Erreur lors de la mise à jour du statut de paiement', isLoading: false });
    }
  },

  updateOrderNotes: async (id, notes) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('orders')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, notes } : order
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notes:', error);
      set({ error: 'Erreur lors de la mise à jour des notes', isLoading: false });
    }
  },
}));


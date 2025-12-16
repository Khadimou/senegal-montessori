import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          const maxStock = product.stockQuantity || 99; // Limite par défaut si pas de stock défini
          
          if (existingItem) {
            // Ne pas dépasser le stock disponible
            const newQuantity = Math.min(existingItem.quantity + 1, maxStock);
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            };
          }
          
          return {
            items: [...state.items, { ...product, quantity: 1 }]
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item => {
            if (item.id === productId) {
              const maxStock = item.stockQuantity || 99;
              return { ...item, quantity: Math.min(quantity, maxStock) };
            }
            return item;
          })
        }));
      },

      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'montessori-cart'
    }
  )
);


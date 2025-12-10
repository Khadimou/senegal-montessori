import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { products as initialProducts } from '@/data/products';

interface ProductsState {
  products: Product[];
  isInitialized: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, inStock: boolean) => void;
  initializeProducts: () => void;
}

const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      isInitialized: false,

      initializeProducts: () => {
        const state = get();
        if (!state.isInitialized || state.products.length === 0) {
          set({ products: initialProducts, isInitialized: true });
        }
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: generateId(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      updateStock: (id, inStock) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, inStock } : product
          ),
        }));
      },
    }),
    {
      name: 'montessori-products',
    }
  )
);


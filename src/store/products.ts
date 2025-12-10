import { create } from 'zustand';
import { Product } from '@/types';
import { supabase, DbProduct } from '@/lib/supabase';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'image'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'image'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, inStock: boolean) => Promise<void>;
}

// Convertir du format DB vers le format App
const dbToProduct = (db: DbProduct): Product => ({
  id: db.id,
  name: db.name,
  description: db.description,
  price: db.price,
  images: db.images || [],
  image: db.images?.[0] || '',  // Première image comme image principale
  category: db.category,
  ageRange: db.age_range,
  inStock: db.in_stock,
  features: db.features || [],
});

// Convertir du format App vers le format DB
const productToDb = (product: Omit<Product, 'id' | 'image'>) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  images: product.images,
  category: product.category,
  age_range: product.ageRange,
  in_stock: product.inStock,
  features: product.features,
});

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products = (data || []).map(dbToProduct);
      set({ products, isLoading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      set({ error: 'Erreur lors du chargement des produits', isLoading: false });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productToDb(productData)])
        .select()
        .single();

      if (error) throw error;

      const newProduct = dbToProduct(data);
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      set({ error: 'Erreur lors de l\'ajout du produit', isLoading: false });
    }
  },

  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.ageRange !== undefined) dbUpdates.age_range = updates.ageRange;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      if (updates.features !== undefined) dbUpdates.features = updates.features;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.map((product) =>
          product.id === id 
            ? { 
                ...product, 
                ...updates,
                image: updates.images?.[0] || product.image 
              } 
            : product
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      set({ error: 'Erreur lors de la mise à jour du produit', isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      set({ error: 'Erreur lors de la suppression du produit', isLoading: false });
    }
  },

  updateStock: async (id, inStock) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: inStock })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, inStock } : product
        ),
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
    }
  },
}));

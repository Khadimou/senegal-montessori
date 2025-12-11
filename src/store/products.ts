import { create } from 'zustand';
import { Product } from '@/types';
import { supabase, DbProduct } from '@/lib/supabase';
import { products as staticProducts } from '@/data/products';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
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
  image: db.images?.[0] || '',
  category: db.category,
  ageRange: db.age_range,
  inStock: db.in_stock,
  features: db.features || [],
  // Champs financiers
  costPrice: db.cost_price || 0,
  stockQuantity: db.stock_quantity || 0,
  minStockAlert: db.min_stock_alert || 5,
  supplier: db.supplier,
  totalSold: db.total_sold || 0,
});

// Convertir les produits statiques vers le nouveau format avec images array
const convertStaticProducts = (): Product[] => {
  return staticProducts.map(p => ({
    ...p,
    images: p.image ? [p.image] : [],
  }));
};

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
  // Champs financiers
  cost_price: product.costPrice || 0,
  stock_quantity: product.stockQuantity || 0,
  min_stock_alert: product.minStockAlert || 5,
  supplier: product.supplier || null,
});

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  lastFetch: null,

  fetchProducts: async () => {
    // Éviter les appels multiples en parallèle
    if (get().isLoading) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        // Fallback vers les données statiques si erreur Supabase
        set({ 
          products: convertStaticProducts(), 
          isLoading: false,
          error: 'Mode hors-ligne: données locales',
          lastFetch: Date.now()
        });
        return;
      }

      if (data && data.length > 0) {
        const products = data.map(dbToProduct);
        set({ products, isLoading: false, lastFetch: Date.now() });
      } else {
        // Si Supabase est vide, utiliser les données statiques
        console.log('Supabase vide, utilisation des données statiques');
        set({ 
          products: convertStaticProducts(), 
          isLoading: false,
          lastFetch: Date.now()
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      // Fallback vers les données statiques
      set({ 
        products: convertStaticProducts(), 
        isLoading: false,
        error: 'Mode hors-ligne: données locales',
        lastFetch: Date.now()
      });
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
      // Champs financiers
      if (updates.costPrice !== undefined) dbUpdates.cost_price = updates.costPrice;
      if (updates.stockQuantity !== undefined) dbUpdates.stock_quantity = updates.stockQuantity;
      if (updates.minStockAlert !== undefined) dbUpdates.min_stock_alert = updates.minStockAlert;
      if (updates.supplier !== undefined) dbUpdates.supplier = updates.supplier;

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

import { create } from 'zustand';
import { PromoCode, PromoCodeValidation, DiscountType } from '@/types';
import { supabase } from '@/lib/supabase';

interface PromoState {
  promoCodes: PromoCode[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD Operations
  fetchPromoCodes: () => Promise<void>;
  addPromoCode: (promoCode: Omit<PromoCode, 'id' | 'usage_count' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => Promise<void>;
  deletePromoCode: (id: string) => Promise<void>;
  togglePromoCode: (id: string, isActive: boolean) => Promise<void>;
  
  // Validation
  validatePromoCode: (code: string, orderAmount: number, customerEmail: string) => Promise<PromoCodeValidation>;
  applyPromoCode: (promoCodeId: string, orderId: string, customerEmail: string, discountApplied: number) => Promise<void>;
}

export const usePromoStore = create<PromoState>((set, get) => ({
  promoCodes: [],
  isLoading: false,
  error: null,

  fetchPromoCodes: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ promoCodes: data || [], isLoading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des codes promo:', error);
      set({ 
        promoCodes: [], 
        isLoading: false,
        error: 'Erreur lors du chargement des codes promo. Vérifiez que la table promo_codes existe.'
      });
    }
  },

  addPromoCode: async (promoCodeData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert([{
          code: promoCodeData.code.toUpperCase(),
          description: promoCodeData.description || null,
          discount_type: promoCodeData.discount_type,
          discount_value: promoCodeData.discount_value,
          min_order_amount: promoCodeData.min_order_amount || 0,
          max_discount: promoCodeData.max_discount || null,
          usage_limit: promoCodeData.usage_limit || null,
          starts_at: promoCodeData.starts_at,
          expires_at: promoCodeData.expires_at || null,
          is_active: promoCodeData.is_active,
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        promoCodes: [data, ...state.promoCodes],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du code promo:', error);
      const errorMessage = error.code === '23505' 
        ? 'Ce code promo existe déjà' 
        : 'Erreur lors de l\'ajout du code promo';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updatePromoCode: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.code !== undefined) dbUpdates.code = updates.code.toUpperCase();
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.discount_type !== undefined) dbUpdates.discount_type = updates.discount_type;
      if (updates.discount_value !== undefined) dbUpdates.discount_value = updates.discount_value;
      if (updates.min_order_amount !== undefined) dbUpdates.min_order_amount = updates.min_order_amount;
      if (updates.max_discount !== undefined) dbUpdates.max_discount = updates.max_discount;
      if (updates.usage_limit !== undefined) dbUpdates.usage_limit = updates.usage_limit;
      if (updates.starts_at !== undefined) dbUpdates.starts_at = updates.starts_at;
      if (updates.expires_at !== undefined) dbUpdates.expires_at = updates.expires_at;
      if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;

      const { error } = await supabase
        .from('promo_codes')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        promoCodes: state.promoCodes.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      set({ error: 'Erreur lors de la mise à jour', isLoading: false });
    }
  },

  deletePromoCode: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        promoCodes: state.promoCodes.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      set({ error: 'Erreur lors de la suppression', isLoading: false });
    }
  },

  togglePromoCode: async (id, isActive) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        promoCodes: state.promoCodes.map((p) =>
          p.id === id ? { ...p, is_active: isActive } : p
        ),
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  },

  validatePromoCode: async (code, orderAmount, customerEmail) => {
    try {
      // Chercher le code promo
      const { data: promo, error } = await supabase
        .from('promo_codes')
        .select('*')
        .ilike('code', code)
        .eq('is_active', true)
        .single();

      if (error || !promo) {
        return { is_valid: false, error_message: 'Code promo invalide' };
      }

      // Vérifier la date de début
      if (new Date(promo.starts_at) > new Date()) {
        return { is_valid: false, error_message: 'Ce code promo n\'est pas encore actif' };
      }

      // Vérifier la date d'expiration
      if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
        return { is_valid: false, error_message: 'Ce code promo a expiré' };
      }

      // Vérifier le montant minimum
      if (orderAmount < promo.min_order_amount) {
        return { 
          is_valid: false, 
          error_message: `Montant minimum requis: ${promo.min_order_amount.toLocaleString()} FCFA` 
        };
      }

      // Vérifier la limite d'utilisation
      if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
        return { is_valid: false, error_message: 'Ce code promo a atteint sa limite d\'utilisation' };
      }

      // Calculer la réduction
      let calculatedDiscount: number;
      if (promo.discount_type === 'percentage') {
        calculatedDiscount = Math.round((orderAmount * promo.discount_value) / 100);
        // Appliquer le plafond si défini
        if (promo.max_discount && calculatedDiscount > promo.max_discount) {
          calculatedDiscount = promo.max_discount;
        }
      } else {
        calculatedDiscount = promo.discount_value;
      }

      // Ne pas dépasser le montant de la commande
      if (calculatedDiscount > orderAmount) {
        calculatedDiscount = orderAmount;
      }

      return {
        is_valid: true,
        promo_id: promo.id,
        discount_type: promo.discount_type as DiscountType,
        discount_value: promo.discount_value,
        max_discount: promo.max_discount,
        calculated_discount: calculatedDiscount,
      };
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      return { is_valid: false, error_message: 'Erreur lors de la validation du code' };
    }
  },

  applyPromoCode: async (promoCodeId, orderId, customerEmail, discountApplied) => {
    try {
      // Enregistrer l'utilisation
      await supabase.from('promo_code_usage').insert([{
        promo_code_id: promoCodeId,
        order_id: orderId,
        customer_email: customerEmail,
        discount_applied: discountApplied,
      }]);

      // Incrémenter le compteur d'utilisation
      await supabase.rpc('increment_promo_usage', { promo_id: promoCodeId });
      
      // Alternative si la fonction RPC n'existe pas
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('usage_count')
        .eq('id', promoCodeId)
        .single();
      
      if (promo) {
        await supabase
          .from('promo_codes')
          .update({ usage_count: (promo.usage_count || 0) + 1 })
          .eq('id', promoCodeId);
      }
    } catch (error) {
      console.error('Erreur lors de l\'application du code promo:', error);
    }
  },
}));


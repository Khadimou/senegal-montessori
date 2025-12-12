import { create } from 'zustand';
import { Expense, FinancialGoal, FinancialStats, ExpenseCategory, Product } from '@/types';
import { supabase, DbExpense, DbFinancialGoal } from '@/lib/supabase';

interface FinancesState {
  expenses: Expense[];
  goals: FinancialGoal[];
  stats: FinancialStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  calculateStats: (orders: any[], products: Product[]) => Promise<void>;
  updateProductStock: (productId: string, quantity: number, costPrice?: number) => Promise<void>;
}

// Convertir du format DB vers le format App
const dbToExpense = (db: DbExpense, productName?: string): Expense => ({
  id: db.id,
  product_id: db.product_id,
  product_name: productName,
  category: db.category as ExpenseCategory,
  description: db.description,
  amount: db.amount,
  quantity: db.quantity,
  supplier: db.supplier,
  receipt_url: db.receipt_url,
  expense_date: db.expense_date,
  created_at: db.created_at,
  updated_at: db.updated_at,
});

const dbToGoal = (db: DbFinancialGoal): FinancialGoal => ({
  id: db.id,
  name: db.name,
  target_amount: db.target_amount,
  current_amount: db.current_amount,
  goal_type: db.goal_type as 'revenue' | 'profit' | 'savings',
  period: db.period as 'monthly' | 'quarterly' | 'yearly',
  start_date: db.start_date,
  end_date: db.end_date,
  is_active: db.is_active,
  created_at: db.created_at,
  updated_at: db.updated_at,
});

export const useFinancesStore = create<FinancesState>((set, get) => ({
  expenses: [],
  goals: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    
    try {
      // Récupérer les dépenses avec le nom du produit
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select(`
          *,
          products:product_id (name)
        `)
        .order('expense_date', { ascending: false });

      if (error) throw error;

      const formattedExpenses = (expenses || []).map((e: any) => 
        dbToExpense(e, e.products?.name)
      );
      
      set({ expenses: formattedExpenses, isLoading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des dépenses:', error);
      set({ 
        expenses: [], 
        isLoading: false,
        error: 'Erreur lors du chargement des dépenses. Vérifiez que la table expenses existe.'
      });
    }
  },

  addExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          product_id: expenseData.product_id || null,
          category: expenseData.category,
          description: expenseData.description,
          amount: expenseData.amount,
          quantity: expenseData.quantity || 0,
          supplier: expenseData.supplier || null,
          receipt_url: expenseData.receipt_url || null,
          expense_date: expenseData.expense_date,
        }])
        .select()
        .single();

      if (error) throw error;

      // Si c'est un achat de stock ET que l'utilisateur veut mettre à jour le stock
      const shouldUpdateStock = (expenseData as any).updateStock;
      if (expenseData.category === 'stock' && expenseData.product_id && expenseData.quantity && shouldUpdateStock) {
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', expenseData.product_id)
          .single();
        
        const newQuantity = (product?.stock_quantity || 0) + expenseData.quantity;
        
        await supabase
          .from('products')
          .update({ stock_quantity: newQuantity })
          .eq('id', expenseData.product_id);
      }

      await get().fetchExpenses();
      set({ isLoading: false });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error);
      set({ error: 'Erreur lors de l\'ajout de la dépense', isLoading: false });
    }
  },

  updateExpense: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
      if (updates.supplier !== undefined) dbUpdates.supplier = updates.supplier;
      if (updates.expense_date !== undefined) dbUpdates.expense_date = updates.expense_date;

      const { error } = await supabase
        .from('expenses')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      set({ error: 'Erreur lors de la mise à jour', isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      set({ error: 'Erreur lors de la suppression', isLoading: false });
    }
  },

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const goals = (data || []).map(dbToGoal);
      set({ goals, isLoading: false });
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
      set({ goals: [], isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert([{
          name: goalData.name,
          target_amount: goalData.target_amount,
          current_amount: goalData.current_amount || 0,
          goal_type: goalData.goal_type,
          period: goalData.period,
          start_date: goalData.start_date,
          end_date: goalData.end_date,
          is_active: goalData.is_active ?? true,
        }])
        .select()
        .single();

      if (error) throw error;

      const newGoal = dbToGoal(data);
      set((state) => ({
        goals: [newGoal, ...state.goals],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'objectif:', error);
      set({ error: 'Erreur lors de l\'ajout de l\'objectif', isLoading: false });
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('financial_goals')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...updates } : g
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      set({ error: 'Erreur lors de la mise à jour', isLoading: false });
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      set({ error: 'Erreur lors de la suppression', isLoading: false });
    }
  },

  calculateStats: async (orders, products) => {
    const expenses = get().expenses;
    
    // Filtrer les commandes payées/livrées
    const paidOrders = orders.filter(o => 
      o.status === 'delivered' || o.payment_status === 'done'
    );
    
    // Calculs de base
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    // Pour les dépenses, on utilise amount directement (maintenant stocké comme total)
    // Le montant est déjà le total = prix unitaire × quantité
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const totalOrders = paidOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Produits les plus vendus
    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};
    paidOrders.forEach(order => {
      order.items.forEach((item: any) => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = { 
            name: item.product_name, 
            sold: 0, 
            revenue: 0 
          };
        }
        productSales[item.product_id].sold += item.quantity;
        productSales[item.product_id].revenue += item.price * item.quantity;
      });
    });

    const topSellingProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        totalSold: data.sold,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // Produits avec stock bas
    const lowStockProducts = products
      .filter(p => (p.stockQuantity || 0) <= (p.minStockAlert || 5))
      .map(p => ({
        id: p.id,
        name: p.name,
        stockQuantity: p.stockQuantity || 0,
        minStockAlert: p.minStockAlert || 5,
      }))
      .slice(0, 5);

    // Revenus par mois
    const monthlyData: Record<string, { revenue: number; expenses: number }> = {};
    
    paidOrders.forEach(order => {
      const month = new Date(order.created_at).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expenses: 0 };
      }
      monthlyData[month].revenue += order.total;
    });

    expenses.forEach(expense => {
      const month = new Date(expense.expense_date).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expenses: 0 };
      }
      monthlyData[month].expenses += expense.amount;
    });

    const revenueByMonth = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.revenue - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    // Dépenses par catégorie
    const expensesByCategory: Record<ExpenseCategory, number> = {
      stock: 0,
      marketing: 0,
      transport: 0,
      autres: 0,
    };

    expenses.forEach(expense => {
      expensesByCategory[expense.category] += expense.amount;
    });

    const expensesByCategoryArray = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .filter(e => e.amount > 0);

    set({
      stats: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        profitMargin,
        totalOrders,
        averageOrderValue,
        topSellingProducts,
        lowStockProducts,
        revenueByMonth,
        expensesByCategory: expensesByCategoryArray,
      },
    });
  },

  updateProductStock: async (productId, quantity, costPrice) => {
    try {
      const updates: Record<string, unknown> = {
        stock_quantity: quantity,
      };
      if (costPrice !== undefined) {
        updates.cost_price = costPrice;
      }

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
    }
  },
}));


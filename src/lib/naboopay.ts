// Client API NabooPay
// Documentation: https://docs.naboopay.com/docs/intro/

const NABOOPAY_API_KEY = process.env.NABOOPAY_API_KEY!;
const NABOOPAY_BASE_URL = process.env.NABOOPAY_BASE_URL || 'https://api.naboopay.com/api/v1';

// Types
export type PaymentMethod = 'WAVE' | 'ORANGE_MONEY' | 'FREE_MONEY' | 'BANK';

export interface NabooProduct {
  name: string;
  category: string;
  amount: number;
  quantity: number;
  description: string;
}

export interface CreateTransactionRequest {
  method_of_payment: PaymentMethod[];
  products: NabooProduct[];
  success_url: string;
  error_url: string;
  is_escrow: boolean;
  is_merchant: boolean;
}

export interface NabooTransaction {
  order_id: string;
  method_of_payment: PaymentMethod[];
  amount: number;
  amount_to_pay: number;
  currency: string;
  transaction_status: 'pending' | 'paid' | 'done' | 'part_paid' | 'failed';
  is_escrow: boolean;
  is_merchant: boolean;
  checkout_url: string;
  created_at: string;
}

export interface CreateTransactionResponse {
  order_id: string;
  checkout_url: string;
  amount: number;
  amount_to_pay: number;
  transaction_status: string;
  created_at: string;
}

// Client NabooPay
class NabooPayClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = NABOOPAY_API_KEY;
    this.baseUrl = NABOOPAY_BASE_URL;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`[NabooPay] ${method} ${endpoint}`);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[NabooPay] Error: ${response.status} - ${errorText}`);
      throw new Error(`NabooPay API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Crée une nouvelle transaction de paiement
   * Limite: 1-20 produits, max 2,000,000 XOF par transaction
   */
  async createTransaction(
    products: NabooProduct[],
    successUrl: string,
    errorUrl: string,
    paymentMethods: PaymentMethod[] = ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY', 'BANK']
  ): Promise<CreateTransactionResponse> {
    // Validation
    if (products.length === 0 || products.length > 20) {
      throw new Error('Le nombre de produits doit être entre 1 et 20');
    }

    const totalAmount = products.reduce((sum, p) => sum + (p.amount * p.quantity), 0);
    if (totalAmount > 2000000) {
      throw new Error('Le montant total ne peut pas dépasser 2,000,000 XOF');
    }

    const payload: CreateTransactionRequest = {
      method_of_payment: paymentMethods,
      products,
      success_url: successUrl,
      error_url: errorUrl,
      is_escrow: false, // Pas d'escrow = paiement direct
      is_merchant: true, // Boutique e-commerce
    };

    return this.request<CreateTransactionResponse>(
      'PUT',
      '/transaction/create-transaction',
      payload
    );
  }

  /**
   * Récupère les détails d'une transaction
   */
  async getTransaction(orderId: string): Promise<NabooTransaction> {
    return this.request<NabooTransaction>(
      'GET',
      `/transaction/${orderId}`
    );
  }

  /**
   * Récupère la liste des transactions
   */
  async getTransactions(params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<{ transactions: NabooTransaction[] }> {
    let endpoint = '/transaction/get-transactions';
    
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.set('status', params.status);
      if (params.from_date) searchParams.set('from_date', params.from_date);
      if (params.to_date) searchParams.set('to_date', params.to_date);
      
      const queryString = searchParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.request<{ transactions: NabooTransaction[] }>('GET', endpoint);
  }

  /**
   * Récupère les informations du compte
   */
  async getAccountInfo(): Promise<{ balance: number; currency: string }> {
    return this.request('GET', '/account/get-account');
  }
}

// Export singleton instance
export const naboopay = new NabooPayClient();

// Helper pour formater les produits du panier vers le format NabooPay
export function formatCartForNabooPay(
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    description?: string;
  }>
): NabooProduct[] {
  return cartItems.map((item) => ({
    name: item.name,
    category: item.category || 'Jouets Montessori',
    amount: item.price,
    quantity: item.quantity,
    description: item.description || item.name,
  }));
}


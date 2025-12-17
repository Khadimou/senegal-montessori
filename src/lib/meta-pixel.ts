// Meta Pixel (Facebook Pixel) configuration
// Documentation: https://developers.facebook.com/docs/meta-pixel

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

// Déclaration pour TypeScript
declare global {
  interface Window {
    fbq: ((command: 'init', pixelId: string) => void) &
         ((command: 'track', eventName: string, params?: Record<string, unknown>) => void) &
         ((command: 'trackCustom', eventName: string, params?: Record<string, unknown>) => void);
    _fbq?: unknown;
  }
}

// Vérifier si le pixel est chargé
const isPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

// PageView - Appelé sur chaque changement de page
export const pageView = () => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  window.fbq('track', 'PageView');
};

// ViewContent - Vue d'un produit
export const viewContent = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: product.price,
    currency: 'XOF',
  });
};

// AddToCart - Ajout au panier
export const addToCart = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: product.price * product.quantity,
    currency: 'XOF',
    num_items: product.quantity,
  });
};

// InitiateCheckout - Début du paiement
export const initiateCheckout = (data: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  numItems: number;
}) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'InitiateCheckout', {
    content_ids: data.items.map(item => item.id),
    contents: data.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    content_type: 'product',
    value: data.total,
    currency: 'XOF',
    num_items: data.numItems,
  });
};

// AddPaymentInfo - Ajout des infos de paiement
export const addPaymentInfo = (data: {
  total: number;
  paymentMethod: string;
}) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'AddPaymentInfo', {
    value: data.total,
    currency: 'XOF',
    content_category: data.paymentMethod,
  });
};

// Purchase - Achat complété
export const purchase = (data: {
  transactionId: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'Purchase', {
    content_ids: data.items.map(item => item.id),
    contents: data.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    content_type: 'product',
    value: data.total,
    currency: 'XOF',
    num_items: data.items.reduce((sum, item) => sum + item.quantity, 0),
    order_id: data.transactionId,
  });
};

// Search - Recherche
export const search = (searchTerm: string) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'Search', {
    search_string: searchTerm,
  });
};

// Lead - Demande de précommande/intérêt
export const lead = (data: {
  productId: string;
  productName: string;
  value?: number;
}) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'Lead', {
    content_ids: [data.productId],
    content_name: data.productName,
    content_category: 'preorder_interest',
    value: data.value || 0,
    currency: 'XOF',
  });
};

// Contact - Formulaire de contact
export const contact = () => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('track', 'Contact');
};

// CustomEvent - Événement personnalisé
export const customEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (!isPixelLoaded() || !META_PIXEL_ID) return;
  
  window.fbq('trackCustom', eventName, params);
};

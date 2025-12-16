// Google Analytics 4 configuration
// Documentation: https://developers.google.com/analytics/devguides/collection/gtagjs

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// E-commerce events
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

export const viewProduct = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'view_item', {
    currency: 'XOF',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
    }]
  });
};

export const addToCart = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'add_to_cart', {
    currency: 'XOF',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: product.quantity,
    }]
  });
};

export const removeFromCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'remove_from_cart', {
    currency: 'XOF',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: product.quantity,
    }]
  });
};

export const beginCheckout = (items: Array<{
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}>, total: number) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'begin_checkout', {
    currency: 'XOF',
    value: total,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    }))
  });
};

export const addPromoCode = (code: string, discount: number) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'add_promo_code', {
    promo_code: code,
    discount_value: discount,
  });
};

export const purchase = (transaction: {
  transaction_id: string;
  value: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
  }>;
  shipping?: number;
  discount?: number;
  promo_code?: string;
}) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'purchase', {
    transaction_id: transaction.transaction_id,
    currency: 'XOF',
    value: transaction.value,
    shipping: transaction.shipping || 0,
    discount: transaction.discount || 0,
    promo_code: transaction.promo_code,
    items: transaction.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    }))
  });
};

export const preorderRequest = (product: {
  id: string;
  name: string;
  quantity: number;
}) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'preorder_request', {
    item_id: product.id,
    item_name: product.name,
    quantity: product.quantity,
  });
};

export const search = (searchTerm: string, resultsCount: number) => {
  if (!GA_TRACKING_ID) return;
  
  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// Types pour window.gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}


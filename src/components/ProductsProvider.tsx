'use client';

import { useEffect } from 'react';
import { useProductsStore } from '@/store/products';

export default function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { fetchProducts } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return <>{children}</>;
}

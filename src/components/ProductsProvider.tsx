'use client';

import { useEffect } from 'react';
import { useProductsStore } from '@/store/products';

export default function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { initializeProducts } = useProductsStore();

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  return <>{children}</>;
}


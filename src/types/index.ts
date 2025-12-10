export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];  // Plusieurs images maintenant
  image: string;     // Image principale (première de la liste)
  category: string;
  ageRange: string;
  inStock: boolean;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

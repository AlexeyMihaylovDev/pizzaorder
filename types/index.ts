export type PizzaSize = 'small' | 'medium' | 'large' | 'family';

export interface Topping {
  id: string;
  name: string;
  nameHe: string;
  category: 'cheese' | 'vegetables' | 'meat' | 'sauces' | 'spices';
  price: number;
}

export interface Pizza {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  basePrice: number;
  prices: {
    small: number;
    medium: number;
    large: number;
    family: number;
  };
  imageUrl: string;
  category: string;
  ingredients: string[];
  availableToppings: string[];
}

export interface Pasta {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  price: number;
  imageUrl: string;
  category: string;
  ingredients: string[];
  size: string;
}

export interface Drink {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  price: number;
  imageUrl: string;
  category: string;
  sizes: string[];
  sizesPrices: { [key: string]: number };
}

export interface Side {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  price: number;
  imageUrl: string;
  category: string;
}

export type ProductType = 'pizza' | 'pasta' | 'drink' | 'side';

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface SelectedPizza extends Omit<Pizza, 'prices'> {
  size: PizzaSize;
  price: number;
  selectedToppings: { toppingId: string; quantity: number }[];
  quantity: number;
}

export interface CartItem {
  productId: string;
  productType: ProductType;
  productName: string;
  productNameHe: string;
  size?: string;
  price: number;
  quantity: number;
  toppings?: { toppingId: string; name: string; price: number; quantity: number }[];
  imageUrl: string;
  customizations?: { [key: string]: any };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productType: ProductType;
  quantity: number;
  price: number;
  customizations?: { [key: string]: any };
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  floor?: string;
  apartment?: string;
  entrance?: string;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

import { Topping } from '../types';

export const toppings: Topping[] = [
  // גבינות - Cheeses
  {
    id: 'mozzarella',
    name: 'Mozzarella',
    nameHe: 'מוצרלה',
    category: 'cheese',
    price: 5,
  },
  {
    id: 'cheddar',
    name: 'Cheddar',
    nameHe: 'צ\'דר',
    category: 'cheese',
    price: 6,
  },
  {
    id: 'parmesan',
    name: 'Parmesan',
    nameHe: 'פארמצ\'ן',
    category: 'cheese',
    price: 7,
  },
  {
    id: 'gorgonzola',
    name: 'Gorgonzola',
    nameHe: 'גורגונזולה',
    category: 'cheese',
    price: 8,
  },
  {
    id: 'ricotta',
    name: 'Ricotta',
    nameHe: 'ריקוטה',
    category: 'cheese',
    price: 6,
  },

  // ירקות - Vegetables
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    nameHe: 'עגבניות',
    category: 'vegetables',
    price: 4,
  },
  {
    id: 'olives',
    name: 'Olives',
    nameHe: 'זיתים',
    category: 'vegetables',
    price: 4,
  },
  {
    id: 'mushrooms',
    name: 'Mushrooms',
    nameHe: 'פטריות',
    category: 'vegetables',
    price: 5,
  },
  {
    id: 'onions',
    name: 'Onions',
    nameHe: 'בצל',
    category: 'vegetables',
    price: 3,
  },
  {
    id: 'peppers',
    name: 'Peppers',
    nameHe: 'פלפלים',
    category: 'vegetables',
    price: 4,
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    nameHe: 'אננס',
    category: 'vegetables',
    price: 5,
  },

  // בשר - Meat
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    nameHe: 'פפרוני',
    category: 'meat',
    price: 8,
  },
  {
    id: 'ham',
    name: 'Ham',
    nameHe: 'נקניק',
    category: 'meat',
    price: 7,
  },
  {
    id: 'bacon',
    name: 'Bacon',
    nameHe: 'בייקון',
    category: 'meat',
    price: 9,
  },
  {
    id: 'chicken',
    name: 'Chicken',
    nameHe: 'עוף',
    category: 'meat',
    price: 8,
  },

  // רטבים - Sauces
  {
    id: 'ketchup',
    name: 'Ketchup',
    nameHe: 'קטשופ',
    category: 'sauces',
    price: 3,
  },
  {
    id: 'garlic',
    name: 'Garlic Sauce',
    nameHe: 'רוטב שום',
    category: 'sauces',
    price: 4,
  },

  // תבלינים - Spices
  {
    id: 'basil',
    name: 'Basil',
    nameHe: 'בזיליקום',
    category: 'spices',
    price: 2,
  },
  {
    id: 'oregano',
    name: 'Oregano',
    nameHe: 'אורגנו',
    category: 'spices',
    price: 2,
  },
];

export const getToppingById = (id: string): Topping | undefined => {
  return toppings.find((t) => t.id === id);
};

export const getToppingsByCategory = (category: Topping['category']): Topping[] => {
  return toppings.filter((t) => t.category === category);
};


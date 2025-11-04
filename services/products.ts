import { Pizza, Pasta, Drink, Side, Product, ProductType } from '../types';

// Импортируем JSON данные
const productsData = require('../data/products.json');

interface ProductsData {
  pizzas: Pizza[];
  pastas: Pasta[];
  drinks: Drink[];
  sides: Side[];
}

const data = productsData as ProductsData;

export const getAllPizzas = (): Pizza[] => {
  return data.pizzas;
};

export const getPizzaById = (id: string): Pizza | undefined => {
  return data.pizzas.find((p) => p.id === id);
};

export const getAllPastas = (): Pasta[] => {
  return data.pastas;
};

export const getPastaById = (id: string): Pasta | undefined => {
  return data.pastas.find((p) => p.id === id);
};

export const getAllDrinks = (): Drink[] => {
  return data.drinks;
};

export const getDrinkById = (id: string): Drink | undefined => {
  return data.drinks.find((d) => d.id === id);
};

export const getAllSides = (): Side[] => {
  return data.sides;
};

export const getSideById = (id: string): Side | undefined => {
  return data.sides.find((s) => s.id === id);
};

export const getAllProducts = (): Product[] => {
  const pizzas: Product[] = data.pizzas.map((p) => ({
    id: p.id,
    type: 'pizza' as ProductType,
    name: p.name,
    nameHe: p.nameHe,
    description: p.description,
    descriptionHe: p.descriptionHe,
    price: p.prices.medium,
    imageUrl: p.imageUrl,
    category: p.category,
  }));

  const pastas: Product[] = data.pastas.map((p) => ({
    id: p.id,
    type: 'pasta' as ProductType,
    name: p.name,
    nameHe: p.nameHe,
    description: p.description,
    descriptionHe: p.descriptionHe,
    price: p.price,
    imageUrl: p.imageUrl,
    category: p.category,
  }));

  const drinks: Product[] = data.drinks.map((d) => ({
    id: d.id,
    type: 'drink' as ProductType,
    name: d.name,
    nameHe: d.nameHe,
    description: d.description,
    descriptionHe: d.descriptionHe,
    price: d.price,
    imageUrl: d.imageUrl,
    category: d.category,
  }));

  const sides: Product[] = data.sides.map((s) => ({
    id: s.id,
    type: 'side' as ProductType,
    name: s.name,
    nameHe: s.nameHe,
    description: s.description,
    descriptionHe: s.descriptionHe,
    price: s.price,
    imageUrl: s.imageUrl,
    category: s.category,
  }));

  return [...pizzas, ...pastas, ...drinks, ...sides];
};

export const getProductById = (id: string, type: ProductType): Pizza | Pasta | Drink | Side | undefined => {
  switch (type) {
    case 'pizza':
      return getPizzaById(id);
    case 'pasta':
      return getPastaById(id);
    case 'drink':
      return getDrinkById(id);
    case 'side':
      return getSideById(id);
    default:
      return undefined;
  }
};

export const getProductsByCategory = (category: string): Product[] => {
  return getAllProducts().filter((p) => p.category === category);
};

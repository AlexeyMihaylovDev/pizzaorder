import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pizza, Order, AuthResponse, User } from '../types';

// Нормализация данных с backend (преобразование ролей из UPPERCASE в lowercase)
const normalizeUser = (user: any): User => ({
  ...user,
  role: user.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
});

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Интерцептор для добавления токена
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('@pizzaorder:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Интерцептор для обработки ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Токен истек или недействителен
          AsyncStorage.removeItem('@pizzaorder:token');
        }
        return Promise.reject(error);
      }
    );
  }

  // Пиццы
  async getPizzas(): Promise<Pizza[]> {
    const response = await this.client.get('/pizzas');
    return response.data;
  }

  async getPizza(id: string): Promise<Pizza> {
    const response = await this.client.get(`/pizzas/${id}`);
    return response.data;
  }

  // Заказы
  async createOrder(orderData: {
    items: { pizzaId: string; quantity: number }[];
    address?: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
  }): Promise<Order> {
    const response = await this.client.post('/orders', orderData);
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.client.get('/orders');
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  // Админ
  async getAdminOrders(): Promise<Order[]> {
    const response = await this.client.get('/admin/orders');
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const response = await this.client.patch(`/admin/orders/${orderId}`, { status });
    return response.data;
  }

  async createPizza(pizzaData: Omit<Pizza, 'id'>): Promise<Pizza> {
    const response = await this.client.post('/admin/pizzas', pizzaData);
    return response.data;
  }

  async updatePizza(id: string, pizzaData: Partial<Pizza>): Promise<Pizza> {
    const response = await this.client.patch(`/admin/pizzas/${id}`, pizzaData);
    return response.data;
  }

  async deletePizza(id: string): Promise<void> {
    await this.client.delete(`/admin/pizzas/${id}`);
  }
}

// Сервис авторизации
class AuthService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', { email, password, name });
    return response.data;
  }
}

export const apiService = new ApiService();
export const authService = new AuthService();


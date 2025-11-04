import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = '@pizzaorder:token';
const USER_STORAGE_KEY = '@pizzaorder:user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.login(email, password);
      // Нормализуем роль пользователя (ADMIN -> admin, USER -> user)
      const normalizedUser = {
        ...response.user,
        role: response.user.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
      };
      setToken(response.token);
      setUser(normalizedUser);
      await Promise.all([
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser)),
      ]);
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response: AuthResponse = await authService.register(email, password, name);
      // Нормализуем роль пользователя (ADMIN -> admin, USER -> user)
      const normalizedUser = {
        ...response.user,
        role: response.user.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
      };
      setToken(response.token);
      setUser(normalizedUser);
      await Promise.all([
        AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser)),
      ]);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_STORAGE_KEY),
        AsyncStorage.removeItem(USER_STORAGE_KEY),
      ]);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


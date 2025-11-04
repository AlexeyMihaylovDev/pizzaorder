import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nManager, Platform } from 'react-native';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';

// Устанавливаем RTL для иврита (для всех платформ)
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);
  // Требуется перезапуск приложения для применения изменений
  if (Platform.OS === 'web') {
    // Для web сразу применяется
  }
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <AuthProvider>
            <CartProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="cart" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="order-success" />
                <Stack.Screen name="orders" />
                <Stack.Screen name="login" />
                <Stack.Screen name="pizza/[id]" />
                <Stack.Screen name="pizza/customize" />
                <Stack.Screen name="admin" />
              </Stack>
            </CartProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

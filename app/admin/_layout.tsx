import React from 'react';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: 'card',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Панель администратора',
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'Заказы',
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          title: 'Управление меню',
        }}
      />
    </Stack>
  );
}


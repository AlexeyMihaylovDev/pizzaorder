import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleOrdersPress = () => {
    router.push('/admin/orders');
  };

  const handleMenuPress = () => {
    router.push('/admin/menu');
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Доступ запрещен" />
        </Appbar.Header>
        <View style={styles.content}>
          <Paragraph>У вас нет доступа к панели администратора</Paragraph>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Панель администратора" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={styles.card} onPress={handleOrdersPress}>
          <Card.Content>
            <Title>Заказы</Title>
            <Paragraph>Просмотр и управление заказами</Paragraph>
            <Button mode="contained" onPress={handleOrdersPress} style={styles.button}>
              Открыть
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={handleMenuPress}>
          <Card.Content>
            <Title>Управление меню</Title>
            <Paragraph>Добавление и редактирование пицц</Paragraph>
            <Button mode="contained" onPress={handleMenuPress} style={styles.button}>
              Открыть
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  button: {
    marginTop: 16,
  },
});


import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Chip,
  Menu,
  ActivityIndicator,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Order } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminOrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Заменить на реальный API
      // const data = await apiService.getAdminOrders();
      // Временно используем моковые данные
      const data: Order[] = [];
      setOrders(data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'confirmed':
        return '#2196f3';
      case 'preparing':
        return '#9c27b0';
      case 'ready':
        return '#4caf50';
      case 'delivered':
        return '#8bc34a';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<Order['status'], string> = {
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      preparing: 'Готовится',
      ready: 'Готов',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return labels[status];
  };

  const handleBack = () => {
    router.back();
  };

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Доступ запрещен" />
        </Appbar.Header>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Заказы" />
        </Appbar.Header>
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Заказы" />
      </Appbar.Header>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Paragraph>Заказов пока нет</Paragraph>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <View>
                    <Title style={styles.orderId}>Заказ #{item.id.slice(0, 8)}</Title>
                    <Paragraph style={styles.orderDate}>
                      {new Date(item.createdAt).toLocaleString('ru-RU')}
                    </Paragraph>
                  </View>
                  <Menu
                    visible={menuVisible === item.id}
                    onDismiss={() => setMenuVisible(null)}
                    anchor={
                      <Chip
                        style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                        textStyle={styles.statusChipText}
                        onPress={() => setMenuVisible(item.id)}
                      >
                        {getStatusLabel(item.status)}
                      </Chip>
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        updateOrderStatus(item.id, 'confirmed');
                        setMenuVisible(null);
                      }}
                      title="Подтвержден"
                    />
                    <Menu.Item
                      onPress={() => {
                        updateOrderStatus(item.id, 'preparing');
                        setMenuVisible(null);
                      }}
                      title="Готовится"
                    />
                    <Menu.Item
                      onPress={() => {
                        updateOrderStatus(item.id, 'ready');
                        setMenuVisible(null);
                      }}
                      title="Готов"
                    />
                    <Menu.Item
                      onPress={() => {
                        updateOrderStatus(item.id, 'delivered');
                        setMenuVisible(null);
                      }}
                      title="Доставлен"
                    />
                    <Menu.Item
                      onPress={() => {
                        updateOrderStatus(item.id, 'cancelled');
                        setMenuVisible(null);
                      }}
                      title="Отменить"
                    />
                  </Menu>
                </View>

                <Paragraph style={styles.total}>Итого: {item.total} ₽</Paragraph>
                {item.address && (
                  <Paragraph style={styles.address}>
                    Адрес: {item.address.city}, {item.address.street}
                  </Paragraph>
                )}
              </Card.Content>
            </Card>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadOrders} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 8,
  },
  card: {
    marginBottom: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    height: 32,
  },
  statusChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


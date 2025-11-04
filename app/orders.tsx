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
  ActivityIndicator,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Order } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { he } from '../i18n/he';

const t = he;

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Заменить на реальный API
      // const data = await apiService.getOrders();
      const data: Order[] = [];
      setOrders(data);
    } catch (error) {
      console.error('שגיאה בטעינת הזמנות:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: Order['status']): string => {
    const labels: Record<Order['status'], string> = {
      pending: t.admin.orderStatus.pending,
      confirmed: t.admin.orderStatus.confirmed,
      preparing: t.admin.orderStatus.preparing,
      ready: t.admin.orderStatus.ready,
      delivered: t.admin.orderStatus.delivered,
      cancelled: t.admin.orderStatus.cancelled,
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']): string => {
    const colors: Record<Order['status'], string> = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      preparing: '#9c27b0',
      ready: '#4caf50',
      delivered: '#8bc34a',
      cancelled: '#f44336',
    };
    return colors[status];
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title={t.orders.title} titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title={t.orders.title} titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.emptyContainer}>
          <Paragraph style={styles.emptyText}>{t.messages.loginRequired}</Paragraph>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={t.orders.title} titleStyle={styles.headerTitle} />
      </Appbar.Header>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Paragraph style={styles.emptyText}>{t.orders.empty}</Paragraph>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <View>
                    <Title style={styles.orderId}>
                      {t.orders.orderNumber}: {item.id.slice(0, 8)}
                    </Title>
                    <Paragraph style={styles.orderDate}>
                      {new Date(item.createdAt).toLocaleString('he-IL')}
                    </Paragraph>
                  </View>
                  <Chip
                    style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                    textStyle={styles.statusChipText}
                  >
                    {getStatusLabel(item.status)}
                  </Chip>
                </View>

                <Paragraph style={styles.total}>
                  {t.orders.total}: {item.total} ₪
                </Paragraph>

                {item.address && (
                  <Paragraph style={styles.address}>
                    {item.address.city}, {item.address.street}
                  </Paragraph>
                )}

                <Paragraph style={styles.itemsCount}>
                  {item.items.length} {t.cart.totalItems}
                </Paragraph>
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
    textAlign: 'right',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
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
    textAlign: 'right',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  itemsCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
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
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  headerTitle: {
    textAlign: 'right',
  },
});


import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Title, Button, Card, Paragraph, Divider, FAB } from 'react-native-paper';
import { CartItem as CartItemComponent } from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'expo-router';
import { he } from '../i18n/he';
import { CartIcon } from '../components/CartIcon';

const t = he;

export default function CartScreen() {
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title={t.cart.title} titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Paragraph style={styles.emptyIcon}>🛒</Paragraph>
          </View>
          <Title style={styles.emptyTitle}>{t.cart.empty}</Title>
          <Paragraph style={styles.emptyText}>
            {t.cart.emptyMessage}
          </Paragraph>
          <Button
            mode="contained"
            onPress={handleBack}
            style={styles.button}
            icon="arrow-left"
          >
            {t.cart.goToMenu}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content 
          title={`${t.cart.title} (${totalItems} ${t.cart.totalItems})`} 
          titleStyle={styles.headerTitle} 
        />
        <Appbar.Action 
          icon="delete-sweep" 
          onPress={handleClearCart}
          disabled={items.length === 0}
        />
      </Appbar.Header>

      <FlatList
        data={items}
        renderItem={({ item, index }) => <CartItemComponent item={item} index={index} />}
        keyExtractor={(item, index) => `${item.productId}-${item.productType}-${index}`}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <Card style={styles.totalCard}>
            <Card.Content>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Paragraph style={styles.summaryLabel}>{t.cart.totalItems}:</Paragraph>
                  <Paragraph style={styles.summaryValue}>{totalItems}</Paragraph>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.totalContainer}>
                  <Title style={styles.totalLabel}>{t.cart.total}:</Title>
                  <Title style={styles.totalPrice}>{totalPrice.toFixed(2)} ₪</Title>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={handleCheckout}
                style={styles.checkoutButton}
                contentStyle={styles.checkoutButtonContent}
                icon="arrow-forward"
              >
                {t.cart.checkout}
              </Button>
            </Card.Content>
          </Card>
        }
      />
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
    paddingBottom: 80,
  },
  totalCard: {
    margin: 8,
    marginTop: 16,
    elevation: 4,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  divider: {
    marginVertical: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
  },
  checkoutButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  checkoutButtonContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  headerTitle: {
    textAlign: 'right',
  },
});

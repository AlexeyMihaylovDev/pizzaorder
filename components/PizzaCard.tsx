import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card, Title, Paragraph, Button, Snackbar, IconButton } from 'react-native-paper';
import { Pizza } from '../types';
import { useRouter } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import { he } from '../i18n/he';

const t = he;

interface PizzaCardProps {
  pizza: Pizza;
}

export const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleCardPress = () => {
    router.push(`/pizza/customize?pizzaId=${pizza.id}`);
  };

  const handleQuickAdd = () => {
    // Анимация нажатия
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const defaultSize = 'medium';
    const defaultPrice = pizza.prices[defaultSize];

    addToCart({
      productId: pizza.id,
      productType: 'pizza',
      productName: pizza.name,
      productNameHe: pizza.nameHe,
      size: defaultSize,
      price: defaultPrice,
      toppings: [],
      imageUrl: pizza.imageUrl,
      quantity: 1,
    });

    setSnackbarVisible(true);
  };

  return (
    <>
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Card style={styles.card} elevation={4}>
          <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
            <Card.Cover source={{ uri: pizza.imageUrl }} style={styles.image} />
            <Card.Content>
              <Title style={styles.title}>{pizza.nameHe}</Title>
              <Paragraph numberOfLines={2} style={styles.description}>
                {pizza.descriptionHe}
              </Paragraph>
              <View style={styles.footer}>
                <View>
                  <Paragraph style={styles.priceLabel}>{t.pizza.price}:</Paragraph>
                  <Title style={styles.price}>{pizza.prices.medium} ₪</Title>
                  <Paragraph style={styles.sizeLabel}>{t.pizza.size.medium}</Paragraph>
                </View>
              </View>
            </Card.Content>
          </TouchableOpacity>
          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleQuickAdd}
              style={styles.addButton}
              contentStyle={styles.addButtonContent}
              buttonColor="#4caf50"
              icon="cart-plus"
            >
              {t.common.add}
            </Button>
          </Card.Actions>
        </Card>
      </Animated.View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: t.cart.title,
          onPress: () => {
            setSnackbarVisible(false);
            router.push('/cart');
          },
        }}
      >
        {t.messages.addedToCart}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
    borderRadius: 16,
    overflow: 'hidden',
    direction: 'rtl',
    backgroundColor: '#fff',
  },
  image: {
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
    lineHeight: 20,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
  },
  sizeLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  actions: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  addButton: {
    borderRadius: 25,
    elevation: 2,
    flex: 1,
  },
  addButtonContent: {
    paddingVertical: 6,
  },
});

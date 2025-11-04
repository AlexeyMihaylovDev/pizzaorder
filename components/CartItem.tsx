import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton, Chip, Button } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../contexts/CartContext';
import { he } from '../i18n/he';
import { useRouter } from 'expo-router';

const t = he;
const AnimatedCard = Animated.createAnimatedComponent(Card);

interface CartItemProps {
  item: CartItemType;
  index: number;
}

export const CartItem: React.FC<CartItemProps> = ({ item, index }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const getSizeLabel = (size?: string) => {
    if (!size) return '';
    const sizeMap: { [key: string]: string } = {
      small: t.pizza.size.small,
      medium: t.pizza.size.medium,
      large: t.pizza.size.large,
      family: t.pizza.size.family,
    };
    return sizeMap[size] || size;
  };

  const handleEdit = () => {
    if (item.productType === 'pizza') {
      router.push(`/pizza/customize?pizzaId=${item.productId}&size=${item.size}`);
    }
  };

  const handleRemove = () => {
    scale.value = withSpring(0.8, { damping: 10 });
    opacity.value = withSpring(0, { damping: 10 }, () => {
      removeFromCart(index);
    });
  };

  const handleQuantityChange = (change: number) => {
    scale.value = withSpring(1.05, { damping: 10 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 150);
    updateQuantity(index, item.quantity + change);
  };

  const itemTotal = item.price * item.quantity;
  const toppingsPrice = item.toppings?.reduce(
    (sum, t) => sum + t.price * t.quantity * item.quantity,
    0
  ) || 0;
  const finalTotal = itemTotal + toppingsPrice;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedCard style={[styles.card, animatedStyle]} elevation={3}>
      <View style={styles.container}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Title style={styles.title}>{item.productNameHe}</Title>
            <IconButton
              icon="close"
              size={20}
              onPress={handleRemove}
              iconColor="#e74c3c"
              style={styles.deleteButton}
            />
          </View>

          {item.size && (
            <Chip style={styles.sizeChip} textStyle={styles.sizeChipText} icon="size-l">
              {getSizeLabel(item.size)}
            </Chip>
          )}

          {item.toppings && item.toppings.length > 0 && (
            <View style={styles.toppingsContainer}>
              <Paragraph style={styles.toppingsLabel}>{t.toppings.title}:</Paragraph>
              <View style={styles.toppingsList}>
                {item.toppings.map((topping, idx) => (
                  <Chip key={idx} style={styles.toppingChip} textStyle={styles.toppingChipText}>
                    {topping.name} {topping.quantity > 1 ? `x${topping.quantity}` : ''}
                    {topping.price > 0 && ` (+${topping.price * topping.quantity}₪)`}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Paragraph style={styles.unitPrice}>
                {item.price} ₪ × {item.quantity} = {itemTotal.toFixed(2)} ₪
              </Paragraph>
            </View>
            {toppingsPrice > 0 && (
              <Paragraph style={styles.toppingsPriceText}>
                {t.toppings.title}: +{toppingsPrice.toFixed(2)} ₪
              </Paragraph>
            )}
            <View style={styles.finalTotalRow}>
              <Title style={styles.finalTotal}>{t.cart.total}: {finalTotal.toFixed(2)} ₪</Title>
            </View>
          </View>

          <View style={styles.controls}>
            <View style={styles.quantityControls}>
              <IconButton
                icon="minus-circle"
                size={24}
                onPress={() => handleQuantityChange(-1)}
                iconColor="#4caf50"
              />
              <View style={styles.quantityBadge}>
                <Paragraph style={styles.quantity}>{item.quantity}</Paragraph>
              </View>
              <IconButton
                icon="plus-circle"
                size={24}
                onPress={() => handleQuantityChange(1)}
                iconColor="#4caf50"
              />
            </View>
            {item.productType === 'pizza' && (
              <Button
                mode="outlined"
                compact
                onPress={handleEdit}
                icon="pencil"
                style={styles.editButton}
              >
                {t.common.edit}
              </Button>
            )}
          </View>
        </View>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
  },
  deleteButton: {
    margin: 0,
  },
  sizeChip: {
    alignSelf: 'flex-end',
    marginTop: 4,
    height: 28,
    backgroundColor: '#e3f2fd',
  },
  sizeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toppingsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  toppingsLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 6,
    fontWeight: '500',
  },
  toppingsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 4,
  },
  toppingChip: {
    height: 24,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  toppingChipText: {
    fontSize: 10,
  },
  priceContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  toppingsPriceText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  finalTotalRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  finalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 4,
  },
  quantityBadge: {
    minWidth: 40,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    marginLeft: 8,
  },
});

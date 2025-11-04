import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  Title,
  Paragraph,
  Button,
  Chip,
  SegmentedButtons,
  Card,
  Divider,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pizza, PizzaSize, Topping } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { toppings, getToppingsByCategory } from '../../data/toppings';
import { he } from '../../i18n/he';
import { getPizzaById } from '../../services/products';

const t = he;

export default function CustomizePizzaScreen() {
  const { pizzaId, size: initialSize } = useLocalSearchParams<{ pizzaId: string; size?: PizzaSize }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [pizza, setPizza] = useState<Pizza | null>(null);
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(initialSize || 'medium');
  const [selectedToppings, setSelectedToppings] = useState<{ [key: string]: number }>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadPizza();
  }, [pizzaId]);

  const loadPizza = async () => {
    // Загружаем из JSON
    const pizzaData = getPizzaById(pizzaId);
    if (pizzaData) {
      setPizza(pizzaData);
    }
  };

  const handleSizeChange = (size: PizzaSize) => {
    setSelectedSize(size);
  };

  const handleToppingToggle = (toppingId: string) => {
    setSelectedToppings((prev) => ({
      ...prev,
      [toppingId]: prev[toppingId] ? 0 : 1,
    }));
  };

  const handleToppingQuantityChange = (toppingId: string, change: number) => {
    setSelectedToppings((prev) => {
      const current = prev[toppingId] || 0;
      const newValue = Math.max(0, current + change);
      if (newValue === 0) {
        const { [toppingId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [toppingId]: newValue };
    });
  };

  const calculatePrice = () => {
    if (!pizza) return 0;
    const basePrice = pizza.prices[selectedSize];
    const toppingsPrice = Object.entries(selectedToppings).reduce((sum, [toppingId, qty]) => {
      const topping = toppings.find((t) => t.id === toppingId);
      return sum + (topping ? topping.price * qty : 0);
    }, 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!pizza) return;

    const toppingsList = Object.entries(selectedToppings)
      .filter(([_, qty]) => qty > 0)
      .map(([toppingId, qty]) => {
        const topping = toppings.find((t) => t.id === toppingId);
        return {
          toppingId,
          name: topping?.nameHe || topping?.name || '',
          price: topping?.price || 0,
          quantity: qty,
        };
      });

    const basePrice = pizza.prices[selectedSize];
    const toppingsTotal = toppingsList.reduce((sum, t) => sum + t.price * t.quantity, 0);
    const pricePerUnit = basePrice + toppingsTotal;

    addToCart({
      productId: pizza.id,
      productType: 'pizza',
      productName: pizza.name,
      productNameHe: pizza.nameHe,
      size: selectedSize,
      price: pricePerUnit,
      toppings: toppingsList,
      imageUrl: pizza.imageUrl,
      quantity,
    });

    // Показываем сообщение об успехе и возвращаемся назад
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  if (!pizza) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title={t.pizza.chooseToppings} />
        </Appbar.Header>
      </SafeAreaView>
    );
  }

  const categories: Topping['category'][] = ['cheese', 'vegetables', 'meat', 'sauces', 'spices'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={pizza.nameHe} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Image source={{ uri: pizza.imageUrl }} style={styles.image} />

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>{pizza.nameHe}</Title>
            <Paragraph style={styles.description}>{pizza.descriptionHe}</Paragraph>
          </Card.Content>
        </Card>

        {/* Размер */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>{t.pizza.chooseSize}</Title>
            <SegmentedButtons
              value={selectedSize}
              onValueChange={handleSizeChange}
              buttons={[
                { value: 'small', label: t.pizza.size.small },
                { value: 'medium', label: t.pizza.size.medium },
                { value: 'large', label: t.pizza.size.large },
                { value: 'family', label: t.pizza.size.family },
              ]}
              style={styles.segmentedButtons}
            />
            <Paragraph style={styles.price}>
              {t.pizza.price}: {pizza.prices[selectedSize]} ₪
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Топпинги */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>{t.pizza.chooseToppings}</Title>
            {categories.map((category) => {
              const categoryToppings = getToppingsByCategory(category);
              const categoryName = t.toppings.categories[category];
              if (categoryToppings.length === 0) return null;

              return (
                <View key={category} style={styles.categorySection}>
                  <Title style={styles.categoryTitle}>{categoryName}</Title>
                  <View style={styles.toppingsGrid}>
                    {categoryToppings.map((topping) => {
                      const quantity = selectedToppings[topping.id] || 0;
                      const isSelected = quantity > 0;

                      return (
                        <Card
                          key={topping.id}
                          style={[
                            styles.toppingCard,
                            isSelected && styles.toppingCardSelected,
                          ]}
                        >
                          <Card.Content style={styles.toppingContent}>
                            <View style={styles.toppingInfo}>
                              <Paragraph style={styles.toppingName}>
                                {topping.nameHe}
                              </Paragraph>
                              <Paragraph style={styles.toppingPrice}>
                                +{topping.price} ₪
                              </Paragraph>
                            </View>
                            {isSelected ? (
                              <View style={styles.quantityControls}>
                                <Button
                                  mode="outlined"
                                  compact
                                  onPress={() => handleToppingQuantityChange(topping.id, -1)}
                                >
                                  -
                                </Button>
                                <Paragraph style={styles.quantity}>{quantity}</Paragraph>
                                <Button
                                  mode="outlined"
                                  compact
                                  onPress={() => handleToppingQuantityChange(topping.id, 1)}
                                >
                                  +
                                </Button>
                              </View>
                            ) : (
                              <Button
                                mode="outlined"
                                compact
                                onPress={() => handleToppingToggle(topping.id)}
                              >
                                {t.common.add}
                              </Button>
                            )}
                          </Card.Content>
                        </Card>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </Card.Content>
        </Card>

        {/* Количество */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.quantityContainer}>
              <Title style={styles.quantityLabel}>{t.pizza.quantity}:</Title>
              <View style={styles.quantityControls}>
                <Button
                  mode="outlined"
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Title style={styles.quantity}>{quantity}</Title>
                <Button
                  mode="outlined"
                  onPress={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Футер с ценой */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Paragraph style={styles.totalLabel}>{t.pizza.total}:</Paragraph>
            <Title style={styles.totalPrice}>{calculatePrice()} ₪</Title>
          </View>
          <Button
            mode="contained"
            onPress={handleAddToCart}
            style={styles.addButton}
            contentStyle={styles.addButtonContent}
          >
            {t.pizza.addToCart}
          </Button>
        </View>
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
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  card: {
    margin: 12,
    marginBottom: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  segmentedButtons: {
    marginVertical: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
    marginTop: 8,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  toppingsGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  toppingCard: {
    marginBottom: 8,
    elevation: 1,
  },
  toppingCardSelected: {
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  toppingContent: {
    paddingVertical: 8,
  },
  toppingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toppingName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  toppingPrice: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
    elevation: 8,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
  },
  addButton: {
    borderRadius: 8,
    marginRight: 0,
  },
  addButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});


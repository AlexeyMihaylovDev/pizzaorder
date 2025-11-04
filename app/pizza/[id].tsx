import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pizza } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { apiService } from '../../services/api';

export default function PizzaDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [pizza, setPizza] = useState<Pizza | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadPizza();
  }, [id]);

  const loadPizza = async () => {
    try {
      setLoading(true);
      // TODO: Заменить на реальный API
      // const data = await apiService.getPizza(id);
      // Временно используем моковые данные
      const mockPizza = mockPizzas.find((p) => p.id === id);
      if (mockPizza) {
        setPizza(mockPizza);
      }
    } catch (error) {
      console.error('Ошибка загрузки пиццы:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (pizza) {
      addToCart(pizza, quantity);
      router.back();
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Пицца" />
        </Appbar.Header>
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!pizza) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Пицца не найдена" />
        </Appbar.Header>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={pizza.name} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Image source={{ uri: pizza.imageUrl }} style={styles.image} />
        
        <View style={styles.info}>
          <View style={styles.header}>
            <Title style={styles.title}>{pizza.name}</Title>
            <Title style={styles.price}>{pizza.price} ₽</Title>
          </View>

          <Chip style={styles.chip} mode="outlined">
            {pizza.category}
          </Chip>

          <Paragraph style={styles.description}>{pizza.description}</Paragraph>

          <Title style={styles.sectionTitle}>Ингредиенты:</Title>
          <View style={styles.ingredients}>
            {pizza.ingredients.map((ingredient, index) => (
              <Chip key={index} style={styles.ingredientChip}>
                {ingredient}
              </Chip>
            ))}
          </View>

          <View style={styles.quantityContainer}>
            <Title style={styles.quantityLabel}>Количество:</Title>
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

          <Button
            mode="contained"
            onPress={handleAddToCart}
            style={styles.addButton}
            contentStyle={styles.addButtonContent}
          >
            Добавить в корзину ({pizza.price * quantity} ₽)
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Временные моковые данные (дублируются с index.tsx, в продакшене будут из API)
const mockPizzas: Pizza[] = [
  {
    id: '1',
    name: 'Маргарита',
    description: 'Классическая пицца с томатами, моцареллой и базиликом',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    category: 'Классическая',
    ingredients: ['томаты', 'моцарелла', 'базилик'],
  },
  {
    id: '2',
    name: 'Пепперони',
    description: 'Острая пицца с пепперони и сыром',
    price: 550,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    category: 'Острая',
    ingredients: ['пепперони', 'моцарелла', 'помидоры'],
  },
  {
    id: '3',
    name: 'Гавайская',
    description: 'Пицца с ветчиной и ананасами',
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: 'Экзотическая',
    ingredients: ['ветчина', 'ананасы', 'моцарелла'],
  },
  {
    id: '4',
    name: 'Четыре сыра',
    description: 'Пицца с четырьмя видами сыра',
    price: 650,
    imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
    category: 'Сыры',
    ingredients: ['моцарелла', 'горгонзола', 'пармезан', 'рикотта'],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  info: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  chip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ingredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  ingredientChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 8,
  },
  addButtonContent: {
    paddingVertical: 8,
  },
});


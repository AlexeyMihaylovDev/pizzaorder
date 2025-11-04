import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Searchbar, ActivityIndicator, Paragraph, Text, Chip, IconButton } from 'react-native-paper';
import { PizzaCard } from '../components/PizzaCard';
import { CartFloatingButton } from '../components/CartFloatingButton';
import { MenuDrawer, CategoryType } from '../components/MenuDrawer';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { he } from '../i18n/he';
import { getAllProducts } from '../services/products';

const t = he;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const { totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const fadeAnim = React.useRef(new RNAnimated.Value(0)).current;
  const slideAnim = React.useRef(new RNAnimated.Value(-50)).current;
  const categoryAnim = React.useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    loadProducts();
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    filterProducts();
    // Анимация смены категории
    categoryAnim.setValue(0);
    RNAnimated.timing(categoryAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedCategory]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('שגיאה בטעינת מוצרים:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'salads') {
        filtered = filtered.filter((product) => product.type === 'side');
      } else {
        filtered = filtered.filter((product) => product.type === selectedCategory);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nameHe.toLowerCase().includes(query) ||
          product.name.toLowerCase().includes(query) ||
          product.descriptionHe.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAdminPress = () => {
    router.push('/admin');
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header style={styles.header} elevation={2}>
        {/* Кнопка меню справа (RTL) */}
        <View style={styles.rightSection}>
          <IconButton
            icon="menu"
            size={28}
            iconColor="#fff"
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          />
        </View>
        
        {/* Заголовок по центру */}
        <View style={styles.headerContent}>
          <RNAnimated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <Text style={styles.headerTitle}>אסא</Text>
            <Text style={styles.headerSubtitle}>פיצרייה</Text>
          </RNAnimated.View>
        </View>
        
        {/* Действия слева (RTL) */}
        <View style={styles.leftSection}>
          {user?.role === 'admin' && (
            <Appbar.Action icon="shield-account" onPress={handleAdminPress} />
          )}
          {!isAuthenticated && (
            <Appbar.Action icon="account-circle" onPress={handleLoginPress} />
          )}
        </View>
      </Appbar.Header>

      {/* Чипы категорий с анимацией */}
      <RNAnimated.View
        style={[
          styles.categoriesContainer,
          {
            opacity: categoryAnim,
            transform: [
              {
                translateX: categoryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <FlatList
          horizontal
          data={[
            { id: 'all' as CategoryType, label: t.menu.all },
            { id: 'pizzas' as CategoryType, label: t.menu.pizzas },
            { id: 'pastas' as CategoryType, label: t.menu.pastas },
            { id: 'salads' as CategoryType, label: t.menu.salads },
          ]}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item.id}
              onPress={() => setSelectedCategory(item.id)}
              style={[
                styles.categoryChip,
                selectedCategory === item.id && styles.categoryChipActive,
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === item.id && styles.categoryChipTextActive,
              ]}
            >
              {item.label}
            </Chip>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </RNAnimated.View>

      <View style={styles.content}>
        <Searchbar
          placeholder={t.home.searchPlaceholder}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchbarInput}
        />

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>{t.home.empty}</Paragraph>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={({ item, index }) => (
              <RNAnimated.View
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20 * (index % 3), 0],
                      }),
                    },
                  ],
                }}
              >
                <PizzaCard pizza={item as any} />
              </RNAnimated.View>
            )}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={loadProducts} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <CartFloatingButton />
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#e74c3c',
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 60,
  },
  leftSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 60,
  },
  menuButton: {
    margin: 0,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: -4,
    letterSpacing: 1,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 8,
  },
  categoryChip: {
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: '#e74c3c',
  },
  categoryChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  searchbar: {
    margin: 8,
    borderRadius: 12,
    elevation: 2,
    direction: 'rtl', // RTL для поиска
  },
  searchbarInput: {
    textAlign: 'right', // RTL выравнивание текста
    direction: 'rtl',
  },
  list: {
    padding: 8,
    paddingBottom: 100,
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
});

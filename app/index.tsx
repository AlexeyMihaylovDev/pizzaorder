import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Searchbar, ActivityIndicator, Paragraph, Text } from 'react-native-paper';
import { PizzaCard } from '../components/PizzaCard';
import { CartIcon } from '../components/CartIcon';
import { CartFloatingButton } from '../components/CartFloatingButton';
import { Pizza } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { he } from '../i18n/he';
import { getAllPizzas } from '../services/products';

const t = he;

export default function HomeScreen() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [filteredPizzas, setFilteredPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadPizzas();
    // Анимация появления заголовка
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    filterPizzas();
  }, [searchQuery, pizzas]);

  const loadPizzas = async () => {
    try {
      setLoading(true);
      const data = getAllPizzas();
      setPizzas(data);
      setFilteredPizzas(data);
    } catch (error) {
      console.error('שגיאה בטעינת פיצות:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPizzas = () => {
    if (!searchQuery.trim()) {
      setFilteredPizzas(pizzas);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = pizzas.filter(
      (pizza) =>
        pizza.nameHe.toLowerCase().includes(query) ||
        pizza.name.toLowerCase().includes(query) ||
        pizza.descriptionHe.toLowerCase().includes(query) ||
        pizza.description.toLowerCase().includes(query)
    );
    setFilteredPizzas(filtered);
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
        {/* Кнопка корзины в левом углу */}
        <View style={styles.leftSection}>
          <CartIcon />
        </View>
        
        {/* Заголовок по центру */}
        <View style={styles.headerContent}>
          <Animated.View
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
          </Animated.View>
        </View>
        
        {/* Действия справа */}
        <View style={styles.headerActions}>
          {user?.role === 'admin' && (
            <Appbar.Action icon="shield-account" onPress={handleAdminPress} />
          )}
          {!isAuthenticated && (
            <Appbar.Action icon="account-circle" onPress={handleLoginPress} />
          )}
        </View>
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder={t.home.searchPlaceholder}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {filteredPizzas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>{t.home.empty}</Paragraph>
          </View>
        ) : (
          <FlatList
            data={filteredPizzas}
            renderItem={({ item }) => (
              <PizzaCard pizza={item} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={loadPizzas} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <CartFloatingButton />
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 60,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 60,
  },
  content: {
    flex: 1,
  },
  searchbar: {
    margin: 8,
    borderRadius: 12,
    elevation: 2,
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

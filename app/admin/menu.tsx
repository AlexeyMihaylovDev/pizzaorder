import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  ActivityIndicator,
  FAB,
  Dialog,
  Portal,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Pizza } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminMenuScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    ingredients: '',
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadPizzas();
    }
  }, [user]);

  const loadPizzas = async () => {
    try {
      setLoading(true);
      // TODO: Заменить на реальный API
      // const data = await apiService.getPizzas();
      // Временно используем моковые данные
      const data: Pizza[] = [];
      setPizzas(data);
    } catch (error) {
      console.error('Ошибка загрузки пицц:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPizza(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category: '',
      ingredients: '',
    });
    setDialogVisible(true);
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price.toString(),
      imageUrl: pizza.imageUrl,
      category: pizza.category,
      ingredients: pizza.ingredients.join(', '),
    });
    setDialogVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    try {
      const pizzaData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/400',
        category: formData.category || 'Другое',
        ingredients: formData.ingredients
          .split(',')
          .map((ing) => ing.trim())
          .filter((ing) => ing),
      };

      if (editingPizza) {
        await apiService.updatePizza(editingPizza.id, pizzaData);
      } else {
        await apiService.createPizza(pizzaData);
      }

      setDialogVisible(false);
      await loadPizzas();
    } catch (error: any) {
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось сохранить пиццу');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Подтверждение', 'Вы уверены, что хотите удалить эту пиццу?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiService.deletePizza(id);
            await loadPizzas();
          } catch (error: any) {
            Alert.alert('Ошибка', 'Не удалось удалить пиццу');
          }
        },
      },
    ]);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Управление меню" />
      </Appbar.Header>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <FlatList
            data={pizzas}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Cover source={{ uri: item.imageUrl }} style={styles.image} />
                <Card.Content>
                  <Title>{item.name}</Title>
                  <Paragraph numberOfLines={2}>{item.description}</Paragraph>
                  <Paragraph style={styles.price}>{item.price} ₽</Paragraph>
                  <View style={styles.actions}>
                    <Button mode="outlined" onPress={() => handleEdit(item)}>
                      Редактировать
                    </Button>
                    <Button
                      mode="outlined"
                      textColor="#f44336"
                      onPress={() => handleDelete(item.id)}
                    >
                      Удалить
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />

          <Portal>
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
              <Dialog.Title>{editingPizza ? 'Редактировать пиццу' : 'Добавить пиццу'}</Dialog.Title>
              <Dialog.ScrollArea>
                <ScrollView style={styles.dialogContent}>
                  <TextInput
                    label="Название"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    mode="outlined"
                    style={styles.input}
                  />
                  <TextInput
                    label="Описание"
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    mode="outlined"
                    multiline
                    style={styles.input}
                  />
                  <TextInput
                    label="Цена (₽)"
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <TextInput
                    label="URL изображения"
                    value={formData.imageUrl}
                    onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                    mode="outlined"
                    style={styles.input}
                  />
                  <TextInput
                    label="Категория"
                    value={formData.category}
                    onChangeText={(text) => setFormData({ ...formData, category: text })}
                    mode="outlined"
                    style={styles.input}
                  />
                  <TextInput
                    label="Ингредиенты (через запятую)"
                    value={formData.ingredients}
                    onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
                    mode="outlined"
                    style={styles.input}
                  />
                </ScrollView>
              </Dialog.ScrollArea>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>Отмена</Button>
                <Button onPress={handleSave}>Сохранить</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <FAB icon="plus" style={styles.fab} onPress={handleAdd} />
        </>
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
  image: {
    height: 200,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogContent: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
});


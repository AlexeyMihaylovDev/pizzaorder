import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { he } from '../i18n/he';

const t = he;

export type CategoryType = 'pizzas' | 'pastas' | 'salads' | 'all';

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
  const router = useRouter();
  const slideAnim = useSharedValue(300); // RTL: начинаем справа (положительное значение)

  React.useEffect(() => {
    if (visible) {
      slideAnim.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      slideAnim.value = withTiming(300, { duration: 200 }); // RTL: уезжаем вправо
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const categories = [
    { id: 'all' as CategoryType, label: t.menu.all, icon: 'food' },
    { id: 'pizzas' as CategoryType, label: t.menu.pizzas, icon: 'pizza' },
    { id: 'pastas' as CategoryType, label: t.menu.pastas, icon: 'pasta' },
    { id: 'salads' as CategoryType, label: t.menu.salads, icon: 'food-apple' },
  ];

  const handleCategorySelect = (category: CategoryType) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View style={[styles.drawer, animatedStyle]}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>{t.menu.title}</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onClose}
              iconColor="#fff"
            />
          </View>
          <View style={styles.drawerContent}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.menuItem,
                  selectedCategory === category.id && styles.menuItemActive,
                ]}
                onPress={() => handleCategorySelect(category.id)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <IconButton
                    icon={category.icon}
                    size={24}
                    iconColor={selectedCategory === category.id ? '#fff' : '#666'}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      selectedCategory === category.id && styles.menuItemTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    right: 0, // RTL: меню выезжает справа
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 }, // RTL: тень слева
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  drawerHeader: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#e74c3c',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  menuItemActive: {
    backgroundColor: '#e74c3c',
  },
  menuItemContent: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    marginLeft: 8,
  },
  menuItemTextActive: {
    color: '#fff',
  },
});

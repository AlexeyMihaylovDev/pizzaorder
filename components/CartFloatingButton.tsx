import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Badge } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'expo-router';

const AnimatedFAB = Animated.createAnimatedComponent(FAB);

export const CartFloatingButton: React.FC = () => {
  const { totalItems, totalPrice } = useCart();
  const router = useRouter();
  
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(totalItems > 0 ? 1 : 0);

  useEffect(() => {
    if (totalItems > 0) {
      badgeScale.value = withSpring(1, {
        damping: 10,
        stiffness: 200,
      });
      scale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
    } else {
      badgeScale.value = withTiming(0, { duration: 200 });
    }
  }, [totalItems, totalPrice]);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    router.push('/cart');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: totalItems > 0 ? 1 : 0,
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  if (totalItems === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <FAB
          icon="cart"
          style={styles.fab}
          onPress={handlePress}
          label={`${totalPrice.toFixed(2)} ₪`}
          color="#fff"
        />
      </Animated.View>
      <Animated.View style={[styles.badgeContainer, badgeAnimatedStyle]}>
        <Badge style={styles.badge} size={22}>
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20, // RTL: кнопка слева
    zIndex: 1000,
  },
  fab: {
    backgroundColor: '#e74c3c',
    elevation: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    left: -6, // RTL: бейдж слева
    zIndex: 1001,
  },
  badge: {
    backgroundColor: '#ff9800',
    color: '#fff',
    minWidth: 24,
    height: 24,
    fontSize: 11,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

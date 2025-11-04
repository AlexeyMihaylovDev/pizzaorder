import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge, IconButton, Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'expo-router';

export const CartIcon: React.FC = () => {
  const { totalItems } = useCart();
  const router = useRouter();
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const badgeScale = useSharedValue(totalItems > 0 ? 1 : 0);

  useEffect(() => {
    if (totalItems > 0) {
      badgeScale.value = withSpring(1, {
        damping: 10,
        stiffness: 200,
      });
      
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
      
      rotation.value = withSequence(
        withTiming(15, { duration: 100 }),
        withTiming(-15, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    } else {
      badgeScale.value = withTiming(0, { duration: 200 });
    }
  }, [totalItems]);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    router.push('/cart');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} activeOpacity={0.7}>
      <Animated.View style={animatedStyle}>
        <IconButton
          icon="cart"
          size={28}
          iconColor="#fff"
          onPress={handlePress}
          style={styles.icon}
        />
      </Animated.View>
      {totalItems > 0 && (
        <>
          <Animated.View style={[styles.badgeContainer, badgeAnimatedStyle]}>
            <Badge style={styles.badge} size={20}>
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          </Animated.View>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{totalItems}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 56,
    minHeight: 56,
  },
  icon: {
    margin: 0,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8, // RTL: бейдж слева
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#ff5722',
    color: '#fff',
    minWidth: 20,
    height: 20,
    fontSize: 10,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#fff',
  },
  countContainer: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 87, 34, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 24,
  },
  countText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

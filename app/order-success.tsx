import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  Title,
  Paragraph,
  Button,
  Card,
  Icon,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { he } from '../i18n/he';

const t = he;

export default function OrderSuccessScreen() {
  const { orderId, total } = useLocalSearchParams<{ orderId?: string; total?: string }>();
  const router = useRouter();
  const [estimatedTime] = useState(30 + Math.floor(Math.random() * 15)); // 30-45 минут

  const handleGoHome = () => {
    router.replace('/');
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.Content title={t.checkout.orderPlaced} titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Icon source="check-circle" size={80} color="#4caf50" />
          </View>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>{t.checkout.orderPlaced}</Title>
            <Paragraph style={styles.message}>
              {t.checkout.orderPlaced}!
            </Paragraph>

            {orderId && (
              <View style={styles.infoRow}>
                <Paragraph style={styles.infoLabel}>{t.checkout.orderNumber}:</Paragraph>
                <Paragraph style={styles.infoValue}>{orderId}</Paragraph>
              </View>
            )}

            {total && (
              <View style={styles.infoRow}>
                <Paragraph style={styles.infoLabel}>{t.cart.total}:</Paragraph>
                <Paragraph style={styles.infoValue}>{total} ₪</Paragraph>
              </View>
            )}

            <View style={styles.infoRow}>
              <Paragraph style={styles.infoLabel}>{t.checkout.estimatedTime}:</Paragraph>
              <Paragraph style={styles.infoValue}>{estimatedTime} {t.checkout.minutes}</Paragraph>
            </View>

            <View style={styles.deliveryInfo}>
              <Icon source="truck-delivery" size={24} color="#4caf50" />
              <Paragraph style={styles.deliveryText}>
                ההזמנה שלך במשלוח! נציג יצור איתך קשר בקרוב.
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>מה הלאה?</Title>
            <Paragraph style={styles.instructions}>
              • תוכל לעקוב אחרי ההזמנה שלך בדף ההזמנות{'\n'}
              • נציג יצור איתך קשר כשההזמנה תצא למשלוח{'\n'}
              • זמן המשלוח המשוער הוא {estimatedTime} דקות
            </Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={handleGoHome}
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="home"
          >
            חזרה לעמוד הראשי
          </Button>
          <Button
            mode="outlined"
            onPress={handleViewOrders}
            style={styles.button}
            contentStyle={styles.buttonContent}
            icon="format-list-bulleted"
          >
            {t.orders.myOrders}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  successIconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#4caf50',
    textAlign: 'right',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    gap: 12,
  },
  deliveryText: {
    flex: 1,
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'right',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'right',
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  headerTitle: {
    textAlign: 'right',
  },
});


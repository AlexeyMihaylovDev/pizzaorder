import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Appbar,
  Title,
  TextInput,
  Button,
  Card,
  Paragraph,
  ActivityIndicator,
  SegmentedButtons,
  RadioButton,
  Divider,
} from 'react-native-paper';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { apiService } from '../services/api';
import { he } from '../i18n/he';

const t = he;

type PaymentMethod = 'cash' | 'card' | 'online';

export default function CheckoutScreen() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Контактная информация
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  // Адрес доставки
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('תל אביב');
  const [zipCode, setZipCode] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [notes, setNotes] = useState('');

  // Способ оплаты
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim() || !phone.trim() || !email.trim()) {
        Alert.alert(t.common.error, t.messages.fillAllFields);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!street.trim() || !city.trim() || !zipCode.trim()) {
        Alert.alert(t.common.error, t.messages.fillAllFields);
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv || !cardHolder)) {
      Alert.alert(t.common.error, t.checkout.payment.title + ': ' + t.messages.fillAllFields);
      return;
    }

    if (!isAuthenticated) {
      Alert.alert(t.common.error, t.messages.loginRequired);
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          productType: item.productType,
          quantity: item.quantity,
          customizations: {
            size: item.size,
            toppings: item.toppings,
            ...item.customizations,
          },
        })),
        address: {
          street: `${street}${floor ? ', קומה ' + floor : ''}${apartment ? ', דירה ' + apartment : ''}${entrance ? ', כניסה ' + entrance : ''}`,
          city,
          zipCode,
          country: 'ישראל',
          notes,
        },
        contact: {
          name,
          phone,
          email,
        },
        paymentMethod,
      };

      const order = await apiService.createOrder(orderData as any);
      const orderId = order?.id || Date.now().toString().slice(-6);
      clearCart();
      router.replace(`/order-success?orderId=${orderId}&total=${totalPrice}`);
    } catch (error: any) {
      console.error('שגיאה בהזמנה:', error);
      Alert.alert(
        t.common.error,
        error.response?.data?.message || t.messages.errorOccurred
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.sectionTitle}>{t.checkout.contact.name}</Title>
        <TextInput
          label={t.checkout.contact.name}
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          textContentType="name"
        />
        <TextInput
          label={t.checkout.contact.phone}
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          placeholder={t.checkout.contact.phonePlaceholder}
        />
        <TextInput
          label={t.checkout.contact.email}
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholder={t.checkout.contact.emailPlaceholder}
        />
      </Card.Content>
    </Card>
  );

  const renderStep2 = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.sectionTitle}>{t.checkout.deliveryAddress}</Title>
        <TextInput
          label={t.checkout.address.street}
          value={street}
          onChangeText={setStreet}
          mode="outlined"
          style={styles.input}
          placeholder={t.checkout.address.streetPlaceholder}
        />
        <TextInput
          label={t.checkout.address.city}
          value={city}
          onChangeText={setCity}
          mode="outlined"
          style={styles.input}
          placeholder={t.checkout.address.cityPlaceholder}
        />
        <TextInput
          label={t.checkout.address.zipCode}
          value={zipCode}
          onChangeText={setZipCode}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          placeholder={t.checkout.address.zipCodePlaceholder}
        />
        <View style={styles.row}>
          <TextInput
            label={t.checkout.address.floor}
            value={floor}
            onChangeText={setFloor}
            mode="outlined"
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label={t.checkout.address.apartment}
            value={apartment}
            onChangeText={setApartment}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
          />
        </View>
        <TextInput
          label={t.checkout.address.entrance}
          value={entrance}
          onChangeText={setEntrance}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label={t.checkout.address.notes}
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder={t.checkout.address.notesPlaceholder}
        />
      </Card.Content>
    </Card>
  );

  const renderStep3 = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.sectionTitle}>{t.checkout.paymentMethod}</Title>
        
        <RadioButton.Group
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          value={paymentMethod}
        >
          <View style={styles.radioOption}>
            <RadioButton value="cash" />
            <Paragraph style={styles.radioLabel}>{t.checkout.payment.cash}</Paragraph>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="card" />
            <Paragraph style={styles.radioLabel}>{t.checkout.payment.card}</Paragraph>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="online" />
            <Paragraph style={styles.radioLabel}>{t.checkout.payment.online}</Paragraph>
          </View>
        </RadioButton.Group>

        {paymentMethod === 'card' && (
          <>
            <Divider style={styles.divider} />
            <TextInput
              label={t.checkout.payment.cardNumber}
              value={cardNumber}
              onChangeText={setCardNumber}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              maxLength={16}
            />
            <View style={styles.row}>
              <TextInput
                label={t.checkout.payment.cardExpiry}
                value={cardExpiry}
                onChangeText={setCardExpiry}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                placeholder="MM/YY"
                maxLength={5}
              />
              <TextInput
                label={t.checkout.payment.cardCvv}
                value={cardCvv}
                onChangeText={setCardCvv}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                maxLength={3}
                secureTextEntry
              />
            </View>
            <TextInput
              label={t.checkout.payment.cardHolder}
              value={cardHolder}
              onChangeText={setCardHolder}
              mode="outlined"
              style={styles.input}
            />
          </>
        )}

        {paymentMethod === 'online' && (
          <Paragraph style={styles.infoText}>
            {t.checkout.payment.online}: תשלום מקוון יבוצע דרך מערכת תשלומים מאובטחת
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={t.checkout.title} titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.stepsContainer}>
        <View style={[styles.step, step >= 1 && styles.stepActive]}>
          <Paragraph style={styles.stepText}>1</Paragraph>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={[styles.step, step >= 2 && styles.stepActive]}>
          <Paragraph style={styles.stepText}>2</Paragraph>
        </View>
        <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
        <View style={[styles.step, step >= 3 && styles.stepActive]}>
          <Paragraph style={styles.stepText}>3</Paragraph>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && (
          <>
            {renderStep3()}
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.sectionTitle}>{t.checkout.orderDetails}</Title>
                {items.map((item, idx) => (
                  <View key={idx} style={styles.orderItem}>
                    <Paragraph style={styles.orderItemName}>
                      {item.productNameHe}
                      {item.size && ` (${item.size})`}
                    </Paragraph>
                    <Paragraph style={styles.orderItemPrice}>
                      {item.quantity} × {item.price} ₪ = {item.price * item.quantity} ₪
                    </Paragraph>
                  </View>
                ))}
                <Divider style={styles.divider} />
                <View style={styles.totalContainer}>
                  <Title style={styles.totalLabel}>{t.cart.total}:</Title>
                  <Title style={styles.totalPrice}>{totalPrice} ₪</Title>
                </View>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {step < 3 ? (
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.nextButton}
              contentStyle={styles.buttonContent}
            >
              {t.common.next}
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                t.checkout.placeOrder
              )}
            </Button>
          )}
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
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: '#4caf50',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#4caf50',
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'right',
  },
  input: {
    marginBottom: 12,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioLabel: {
    marginLeft: 8,
    textAlign: 'right',
  },
  divider: {
    marginVertical: 12,
  },
  infoText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'right',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    flex: 1,
    textAlign: 'right',
  },
  orderItemPrice: {
    textAlign: 'left',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextButton: {
    flex: 1,
    borderRadius: 8,
  },
  submitButton: {
    flex: 1,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  headerTitle: {
    textAlign: 'right',
  },
});

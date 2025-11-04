import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { CartItem, PaymentMethod } from '../types';

const t = he;

export default function CheckoutScreen() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('תל אביב');
  const [zipCode, setZipCode] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [notes, setNotes] = useState('');

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
    } else if (step === 2) {
      if (!street.trim() || !city.trim() || !zipCode.trim()) {
        Alert.alert(t.common.error, t.messages.fillAllFields);
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
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
        <Title style={styles.sectionTitle}>{t.checkout.contact.title}</Title>
        <TextInput
          label={t.checkout.contact.name}
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          placeholder={t.checkout.contact.namePlaceholder}
          textAlign="right"
        />
        <TextInput
          label={t.checkout.contact.phone}
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          placeholder={t.checkout.contact.phonePlaceholder}
          textAlign="right"
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
          textAlign="right"
        />
      </Card.Content>
    </Card>
  );

  const renderStep2 = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.sectionTitle}>{t.checkout.address.title}</Title>
        <TextInput
          label={t.checkout.address.street}
          value={street}
          onChangeText={setStreet}
          mode="outlined"
          style={styles.input}
          placeholder={t.checkout.address.streetPlaceholder}
          textAlign="right"
        />
        <TextInput
          label={t.checkout.address.city}
          value={city}
          onChangeText={setCity}
          mode="outlined"
          style={styles.input}
          placeholder={t.checkout.address.cityPlaceholder}
          textAlign="right"
        />
        <TextInput
          label={t.checkout.address.zipCode}
          value={zipCode}
          onChangeText={setZipCode}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          placeholder={t.checkout.address.zipCodePlaceholder}
          textAlign="right"
        />
        <View style={styles.row}>
          <TextInput
            label={t.checkout.address.floor}
            value={floor}
            onChangeText={setFloor}
            mode="outlined"
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
            textAlign="right"
          />
          <TextInput
            label={t.checkout.address.apartment}
            value={apartment}
            onChangeText={setApartment}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            textAlign="right"
          />
        </View>
        <TextInput
          label={t.checkout.address.entrance}
          value={entrance}
          onChangeText={setEntrance}
          mode="outlined"
          style={styles.input}
          textAlign="right"
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
          textAlign="right"
        />
      </Card.Content>
    </Card>
  );

  const renderStep3 = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.sectionTitle}>{t.checkout.payment.title}</Title>
        <RadioButton.Group
          onValueChange={(newValue: PaymentMethod) => setPaymentMethod(newValue)}
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
              textAlign="right"
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
                textAlign="right"
              />
              <TextInput
                label={t.checkout.payment.cardCvv}
                value={cardCvv}
                onChangeText={setCardCvv}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                maxLength={3}
                textAlign="right"
              />
            </View>
            <TextInput
              label={t.checkout.payment.cardHolder}
              value={cardHolder}
              onChangeText={setCardHolder}
              mode="outlined"
              style={styles.input}
              textAlign="right"
            />
          </>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={t.checkout.title} titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.progressBarContainer}>
        <SegmentedButtons
          value={String(step)}
          onValueChange={(value) => setStep(Number(value))}
          buttons={[
            { value: '1', label: t.checkout.step1 },
            { value: '2', label: t.checkout.step2 },
            { value: '3', label: t.checkout.step3 },
          ]}
          style={styles.segmentedButtons}
        />
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
                      {item.toppings && item.toppings.length > 0 && ` + ${item.toppings.map(t => t.name).join(', ')}`}
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
        <Button
          mode="contained"
          onPress={step < 3 ? handleNext : handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={loading || items.length === 0}
          icon={step < 3 ? "arrow-forward" : "check"}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (step < 3 ? t.common.next : t.checkout.placeOrder)}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    direction: 'rtl', // RTL
  },
  header: {
    backgroundColor: '#e74c3c',
  },
  headerTitle: {
    textAlign: 'right',
  },
  progressBarContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  segmentedButtons: {
    height: 40,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 8,
    elevation: 2,
    direction: 'rtl', // RTL
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'right',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  radioOption: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    textAlign: 'right',
  },
  divider: {
    marginVertical: 16,
  },
  orderItem: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  orderItemPrice: {
    textAlign: 'left',
  },
  totalContainer: {
    flexDirection: 'row-reverse', // RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
    elevation: 8,
  },
  submitButton: {
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});

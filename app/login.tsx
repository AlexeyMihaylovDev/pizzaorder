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
  ActivityIndicator,
  SegmentedButtons,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { he } from '../i18n/he';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const t = he;

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t.common.error, t.messages.fillAllFields);
      return;
    }

    if (mode === 'register' && !name.trim()) {
      Alert.alert(t.common.error, t.auth.nameRequired || 'אנא הכנס שם');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.back();
    } catch (error: any) {
      Alert.alert(
        t.common.error,
        error.response?.data?.message || t.messages.errorOccurred
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content 
          title={mode === 'login' ? t.auth.login : t.auth.register}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={animatedStyle}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>{mode === 'login' ? t.auth.login : t.auth.register}</Title>
                
                <SegmentedButtons
                  value={mode}
                  onValueChange={(value) => setMode(value as 'login' | 'register')}
                  buttons={[
                    { value: 'login', label: t.auth.login },
                    { value: 'register', label: t.auth.register },
                  ]}
                  style={styles.segmentedButtons}
                />

                {mode === 'register' && (
                  <TextInput
                    label={t.auth.name}
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                    autoCapitalize="words"
                    textAlign="right"
                  />
                )}

                <TextInput
                  label={t.auth.email}
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  textAlign="right"
                />

                <TextInput
                  label={t.auth.password}
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry
                  style={styles.input}
                  textAlign="right"
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  contentStyle={styles.submitButtonContent}
                  disabled={loading}
                  buttonColor="#e74c3c"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : mode === 'login' ? (
                    t.auth.login
                  ) : (
                    t.auth.register
                  )}
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'right',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'right',
    color: '#333',
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});

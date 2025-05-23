// app/screens/Auth/PinLock.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  ImageBackground,
  StatusBar,
  ScrollView,
  Keyboard
} from 'react-native';
import { getPin, deletePin } from '../../utils/secureStore';
import { auth } from '../../config/firebase';

const backgroundImage = require('../../../assets/bg-login.png');
const logo = require('../../../assets/logo.png');

export default function PinLock({ navigation }: any) {
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [inputPin, setInputPin]   = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    (async () => {
      const pin = await getPin();
      setStoredPin(pin);
      if (!pin) navigation.replace('SetPin');
    })();
  }, []);

  const handleCheckPin = () => {
    if (loading) return;
    setLoading(true);
    Keyboard.dismiss();
    try {
      if (inputPin === storedPin) {
        navigation.replace('Home');
      } else {
        Alert.alert('Erreur', 'PIN incorrect');
      }
    } catch (err: any) {
      Alert.alert('Erreur de connexion', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async () => {
    await deletePin();
    await auth.signOut();
    navigation.replace('Auth', { screen: 'SignIn' });
  };

  if (storedPin === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar backgroundColor="#020066" barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <Image source={logo} style={styles.logo} />

            <View style={styles.card}>
              <Text style={styles.title}>Déverrouillage</Text>
              <Text style={styles.subtitle}>Veuillez entrer votre code PIN</Text>

              <TextInput
                style={styles.input}
                placeholder="••••"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={inputPin}
                onChangeText={text => {
                  setInputPin(text);
                  if (text.length === 4) {
                    handleCheckPin();
                  }
                }}
                placeholderTextColor="#aaa"
              />

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleCheckPin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#020066" />
                ) : (
                  <Text style={styles.buttonText}>Déverrouiller</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleResetPin}>
                <Text style={styles.forgotPin}>PIN oublié ? Réinitialiser</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 0, 102, 0.4)',
  },
  innerContainer: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 50,
    zIndex: 2,
  },
  card: {
    width: '100%',
    backgroundColor: '#F4CE23',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e2e2e',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '60%',
    height: 56,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#020066',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPin: {
    color: '#2e86de',
    textDecorationLine: 'underline',
  },
});

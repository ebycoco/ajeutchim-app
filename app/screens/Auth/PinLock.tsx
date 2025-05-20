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
} from 'react-native';
import { getPin, deletePin } from '../../utils/secureStore';
import { auth } from '../../config/firebase';

const backgroundImage = require('../../../assets/bg-login.png');
const logo = require('../../../assets/logo.png');

export default function PinLock({ navigation }: any) {
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [inputPin, setInputPin] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const pin = await getPin();
      setStoredPin(pin);
      if (!pin) {
        navigation.replace('SetPin');
      }
    })();
  }, []);

  const handleCheckPin = () => {
    if (loading) return;
    setLoading(true);
    try {
      if (inputPin === storedPin) {
        navigation.replace('Home');
      } else {
        Alert.alert('Erreur', 'PIN incorrect');
      }
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message);
    } finally {
      setLoading(false);
    }

  };

  const handleResetPin = async () => {
    // Supprime le PIN stocké et redirige vers la connexion
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
    >
      <StatusBar backgroundColor="#020066" barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.overlay} />
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
              onChangeText={setInputPin}
              value={inputPin}
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleCheckPin}>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#020066"
                />
              ) : (
                <Text style={styles.buttonText}>Déverrouiller</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResetPin}>
              <Text style={styles.forgotPin}>PIN oublié ? Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 0, 102, 0.4)',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPin: {
    marginTop: 16,
    color: '#2e86de',
    textDecorationLine: 'underline',
  },
});

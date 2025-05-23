// app/screens/Auth/SetPin.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { savePin } from '../../utils/secureStore';

const backgroundImage = require('../../../assets/bg-login.png');
const logo = require('../../../assets/logo.png');

export default function SetPin({ navigation }: any) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSavePin = async () => {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      return Alert.alert('PIN invalide', 'Le PIN doit être composé de 4 chiffres.');
    }
    setLoading(true);
    await savePin(pin);
    setLoading(false);
    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <StatusBar backgroundColor="#020066" barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.overlay} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={logo} style={styles.logo} />

          <View style={styles.card}>
            <Text style={styles.title}>Définir votre code PIN</Text>
            <Text style={styles.subtitle}>Protégez l'accès à votre application</Text>

            <TextInput
              style={styles.input}
              placeholder="••••"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              onChangeText={setPin}
              value={pin}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSavePin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Enregistrement...' : 'Enregistrer le PIN'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1, resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 0, 102, 0.4)',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
    borderRadius: 80,
    zIndex: 1,
  },

  card: {
    width: '100%',
    backgroundColor: '#F4CE23',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2e2e2e',
    marginBottom: 8,
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
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    color: '#333',
  },

  button: {
    backgroundColor: '#020066',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

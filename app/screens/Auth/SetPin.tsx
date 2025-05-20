// app/screens/Auth/SetPin.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,                // ← ajouté
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
  StatusBar,
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
    await savePin(pin);
    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <StatusBar backgroundColor="#020066" barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.background}>
        {/* Overlay pour assombrir le fond */}
        <View style={styles.overlay} />

        <View style={styles.innerContainer}>
          <Image source={logo} style={styles.logo} />

          <View style={styles.card}>
            <Text style={styles.title}>Définir votre code PIN</Text>
            <Text style={styles.subtitle}>Protégez l'accès à votre application</Text>

            <TextInput
              style={styles.input}
              placeholder="••••"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              onChangeText={setPin}
              value={pin}
              placeholderTextColor="#ccc"
            />

            <TouchableOpacity style={styles.button} onPress={handleSavePin}>
              <Text style={styles.buttonText}>Enregistrer le PIN</Text>
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

  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 50,
    zIndex: 1,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#2e2e2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
});

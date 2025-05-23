// app/screens/Auth/SignIn.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  getIdToken,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth } from '../../config/firebase';
import { saveToken } from '../../utils/secureStore';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import AlertModal from '../../components/AlertModal';

const backgroundImage = require('../../../assets/bg-login.png');
const logo = require('../../../assets/logo.png');

type SignInProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
};

export default function SignIn({ navigation }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // état pour AlertModal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'info' | 'success' | 'error'>('info');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (
    type: 'info' | 'success' | 'error',
    message: string
  ) => {
    setModalType(type);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await getIdToken(credential.user, true);
      await saveToken(idToken);
      // navigation.replace('Home'); // décommenter si nécessaire
    } catch (error: any) {
      // Intercepte l’erreur “mot de passe manquant” et affiche un message générique
      if (error.code === 'auth/missing-password' || error.code === 'auth/wrong-password') {
        showModal('error', 'Email ou mot de passe incorrect.');
      } else {
        // Pour toutes les autres erreurs, on remonte le message natif
        showModal('error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showModal('info', 'Veuillez saisir votre email pour réinitialiser votre mot de passe.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showModal('success', 'Un lien de réinitialisation a été envoyé à votre adresse.');
    } catch (error: any) {
      showModal('error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar backgroundColor="#020066" barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.overlay} />
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Bienvenue sur AJEUTCHIM</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ddd"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#ccc"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              textContentType="newPassword"
              autoComplete="password-new"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconContainer}
            >
              <Text style={styles.eyeIcon}>
                {passwordVisible ? '👁️' : '🙈'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotLink}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#020066" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Pas encore de compte ? Inscrivez-vous</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
      {/* Modal d'alerte centralisé */}
      <AlertModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1, resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 0, 102, 0.6)',
  },
  content: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 22,
    color: '#F4CE23',
    fontWeight: '700',
    marginBottom: 32,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  passwordInputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 14,
  },
  eyeIcon: {
    fontSize: 22,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 16,
    color: '#fff',
  },
  forgotLink: {
    color: '#F4CE23',
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#F4CE23',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#020066',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#fff',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});

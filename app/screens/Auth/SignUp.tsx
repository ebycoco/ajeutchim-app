// app/screens/Auth/SignUp.tsx
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
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { saveToken } from '../../utils/secureStore';
import AlertModal from '../../components/AlertModal';

type SignUpProps = {
  navigation: any;
};

const backgroundImage = require('../../../assets/bg-login.png');
const logo = require('../../../assets/logo.png');

// Liste simulée des matricules autorisés (à remplacer par un fetch réel)
const allowedMatricules = ['AJEU2020BY01', 'AJEU2020YK01', 'AJEU2020KB01'];

export default function SignUp({ navigation }: SignUpProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matricule, setMatricule] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignUp = async () => {
    // validations
    if (!firstName || !lastName || !matricule || !email || password.length < 6 || password !== confirmPassword) {
      showModal(
        'error',
        password !== confirmPassword
          ? 'Les mots de passe ne correspondent pas.'
          : 'Veuillez remplir tous les champs correctement.'
      );
      return;
    }
    // Vérification du matricule
    if (!allowedMatricules.includes(matricule.trim().toUpperCase())) {
      showModal('error', 'Ce matricule n’est pas reconnu.');
      return;
    }
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken(true);
      await saveToken(idToken);
      showModal('success', 'Inscription réussie ! Bienvenue.');
      // après une courte pause on redirige
      setTimeout(() => navigation.replace('Home'), 800);
    } catch (error: any) {
      showModal('error', error.message);
    } finally {
      setLoading(false);
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
        {/* On remplace View par ScrollView */}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Créez votre compte</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#ddd"
            autoCapitalize="characters"
            value={lastName}
            onChangeText={text => setLastName(text.toUpperCase())}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#ddd"
            autoCapitalize="characters"
            value={firstName}
            onChangeText={text => setFirstName(text.toUpperCase())}
          />

          {/* Matricule */}
          <TextInput
            style={styles.input}
            placeholder="Matricule d'AJEUTCHIM"
            placeholderTextColor="#ddd"
            autoCapitalize="characters"
            value={matricule}
            onChangeText={t => setMatricule(t.toUpperCase())}
          />

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
            />
          </View>
          {/* Confirmation mot de passe */}
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmez le mot de passe"
              placeholderTextColor="#ccc"
              secureTextEntry={!passwordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#020066" />
              : <Text style={styles.buttonText}>S'inscrire</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.link}>Déjà un compte ? Connectez-vous</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
      {/* Le modal d’alerte */}
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
  // on étend le padding vertical pour que le contenu soit bien centré & scrollable
  content: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 8,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
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
    backgroundColor: '#ddd',
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

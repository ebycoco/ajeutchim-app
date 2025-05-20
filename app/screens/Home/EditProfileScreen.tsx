// app/screens/Home/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';
const logo = require('../../../assets/logo.png');

type EditProfileNav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<EditProfileNav>();
  const user = auth.currentUser;

  // Sépare nom et prénom
  const [lastName, setLastName] = useState(user?.displayName?.split(' ')[0] || '');
  const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[1] || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [commune, setCommune] = useState('');
  const [quartier, setQuartier] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!lastName.trim() || !firstName.trim()) {
      Alert.alert('Erreur', 'Le nom et le prénom sont requis.');
      return;
    }
    const fullName = `${lastName.trim()} ${firstName.trim()}`;
    setSaving(true);
    try {
      // Mettre à jour le profil Firebase Auth
      await updateProfile(user!, { displayName: fullName });
      // Mettre à jour Firestore (collection users)
      const userRef = doc(db, 'users', user!.uid);
      await updateDoc(userRef, { phone, commune, quartier, displayName: fullName });
      Alert.alert('Succès', 'Profil mis à jour.');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#020066" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier mon profil</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        {/* Formulaire */} 
          <View style={styles.field}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Nom"
            />
          </View>

        <View style={styles.field}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Prénom"
            />
          </View>

        <View style={styles.field}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+225..."
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Commune</Text>
          <TextInput
            style={styles.input}
            value={commune}
            onChangeText={setCommune}
            placeholder="Commune"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Quartier</Text>
          <TextInput
            style={styles.input}
            value={quartier}
            onChangeText={setQuartier}
            placeholder="Quartier"
          />
        </View>

        {/* Boutons Annuler / Enregistrer */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.cancelButton, saving && styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Ionicons name="checkmark-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f6fc' },
  header: {
    backgroundColor: '#020066',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backBtn: { width: 24 },
  title: { color: '#F4CE23', fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  logo: { width: 120, height: 120},
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  fieldSmall: { flex: 1, marginHorizontal: 4, marginBottom: 16 },
  field: { width: '100%', marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelText: { color: '#333', fontSize: 16, fontWeight: '600' },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020066',
    paddingVertical: 14,
    borderRadius: 25,
    marginLeft: 8,
  },
  buttonDisabled: { backgroundColor: '#999' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});

// app/screens/Home/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const placeholderAvatar = require('../../../assets/avatar.jpg');

export default function ProfileScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [user, setUser] = useState(auth.currentUser);
  const [uploading, setUploading] = useState(false);

  // Simulated member stats
  const [totalMembers, setTotalMembers] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [noPaidCount, seNotPaidCount] = useState(0);

  useEffect(() => {
    // Simuler récupération stats
    const dummyTotal = 150;
    const dummyPaid = 120;
    const dummyNoPaid = 30;
    setTotalMembers(dummyTotal);
    setPaidCount(dummyPaid);
    seNotPaidCount(dummyNoPaid);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length) {
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const avatarRef = ref(storage, `avatars/${user!.uid}.jpg`);
    await uploadBytes(avatarRef, blob);
    const url = await getDownloadURL(avatarRef);
    await updateProfile(user!, { photoURL: url });
    setUser({ ...user!, photoURL: url });
    setUploading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar */}
      <StatusBar backgroundColor="#020066" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuBtn}>
          <Ionicons name="menu" size={30} color="#F4CE23" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <View style={styles.menuBtn} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Avatar & Info */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} disabled={uploading} style={styles.avatarWrapper}>
            <Image
              source={user?.photoURL ? { uri: user.photoURL } : placeholderAvatar}
              style={styles.avatar}
            />
            {/* Overlay caméra */}
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
            {uploading && <ActivityIndicator style={styles.avatarLoader} color="#020066" />}
          </TouchableOpacity>
          <Text style={styles.name}>BROU YAO ERIC</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {/* Informations complémentaires */}
          <View style={styles.extraInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={16} color="#020066" />
              <Text style={styles.infoText}>{user?.phoneNumber || 'Non renseigné'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="#020066" />
              <Text style={styles.infoText}>Commune de Cocody</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="pin" size={16} color="#020066" />
              <Text style={styles.infoText}>Quartier Riviera</Text>
            </View>
          </View>
        </View>
        {/* Bouton modifier profil */}
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>

        <View style={styles.statsTitleContainer}>
          <Text style={styles.statsTitle}>Statistiques de AJEUTCHIM</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <Ionicons name="people" size={24} color="#020066" />
            <Text style={styles.statNumber}>{totalMembers}</Text>
            <Text style={styles.statLabel}>Membres</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRight]}>
            <Ionicons name="checkmark-circle" size={24} color="#28a745" />
            <Text style={styles.statNumber}>{paidCount}</Text>
            <Text style={styles.statLabel}>À jour</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRight]}>
            <Ionicons name="alert-circle" size={24} color="#dc3545" />
            <Text style={styles.statNumber}>{noPaidCount}</Text>
            <Text style={styles.statLabel}>Non à jour</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f6fc' },
  header: {
    backgroundColor: '#020066',
    paddingTop: 25,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  menuBtn: { width: 28 },
  headerTitle: { color: '#F4CE23', fontSize: 20, fontWeight: '700' },

  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff' },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(2, 0, 102, 0.8)',
    borderRadius: 16,
    padding: 6,
  },
  avatarLoader: { position: 'absolute', top: 48, left: 48 },
  name: { fontSize: 22, fontWeight: '700', color: '#020066', marginTop: 12 },
  email: { fontSize: 14, color: '#F4CE23', marginTop: 4 },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardLeft: { marginRight: 10 },
  statCardRight: { marginLeft: 10 },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#020066', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  extraInfo: {
    marginTop: 8,
    width: '80%',
    alignItems: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020066',
    paddingVertical: 10,
    marginHorizontal: 40,
    borderRadius: 25,
    marginTop: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsTitleContainer: {
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#020066',
    textAlign: 'center',
  },

});

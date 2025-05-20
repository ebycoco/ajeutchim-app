// app/screens/Home/LaunchMeetingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';

export default function LaunchMeetingScreen({ navigation }: any) {
  const [topic, setTopic] = useState('');
  const [meetingId] = useState(() => Math.random().toString(36).substr(2, 9));

  const startMeeting = () => {
    // ici vous pourriez appeler votre backend / SDK pour créer la réunion
    // puis naviguer vers l'écran de la réunion en direct, par exemple MeetingRoom
    const hostId = auth.currentUser?.uid || 'unknown';
    navigation.navigate('MeetingRoom', { meetingId, topic, hostId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#020066" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lancer une réunion</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Sujet de la réunion</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez un sujet (ex. Bilan mensuel)"
          placeholderTextColor="#888"
          value={topic}
          onChangeText={setTopic}
        />
        <Text style={styles.info}>
          ID de réunion généré : <Text style={styles.meetingId}>{meetingId}</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.startBtn, !topic.trim() && styles.startBtnDisabled]}
        onPress={startMeeting}
        disabled={!topic.trim()}
      >
        <Ionicons name="videocam-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.startBtnText}>Démarrer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#f2f6fc' },
  header:        { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#020066',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20, },
  backBtn:       { marginRight: 12 },
  headerTitle:   { flex: 1, color: '#F4CE23', fontSize: 20, fontWeight: '700' },

  content:       { flex: 1, padding: 16 },
  label:         { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input:         {
                   borderWidth: 1,
                   borderColor: '#ccc',
                   borderRadius: 8,
                   paddingHorizontal: 12,
                   paddingVertical: 8,
                   fontSize: 14,
                   backgroundColor: '#fff',
                 },
  info:          { marginTop: 12, fontSize: 14, color: '#666' },
  meetingId:     { fontWeight: '600', color: '#020066' },

  startBtn:      {
                   flexDirection: 'row',
                   alignItems: 'center',
                   justifyContent: 'center',
                   backgroundColor: '#020066',
                   padding: 16,
                   margin: 16,
                   borderRadius: 30,
                   elevation: 3,
                 },
  startBtnDisabled: {
                   backgroundColor: '#888',
                 },
  startBtnText:  { color: '#fff', fontSize: 16, fontWeight: '600' },
});

// app/screens/Home/ForumScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const dummyForumMessages = [
  {
    id: 'f1',
    sender: 'Alice Martin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    text: 'Bienvenue sur le forum AJEUTCHIM !',
    date: '2025-05-04T10:00:00',
  },
  {
    id: 'f2',
    sender: 'Bruno Dupont',
    avatar: 'https://i.pravatar.cc/150?img=2',
    text: 'N’oubliez pas notre réunion demain à 18h.',
    date: '2025-05-04T11:15:00',
  },
  {
    id: 'f3',
    sender: 'Carole Bernard',
    avatar: 'https://i.pravatar.cc/150?img=3',
    text: 'Je partage le compte-rendu de la dernière AG.',
    date: '2025-05-03T12:30:00',
  },
];

// utilitaire de groupement
function getDayKey(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const msgMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((todayMid.getTime() - msgMid.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd’hui';
  if (diffDays === 1) return 'Hier';
  return d.toLocaleDateString('fr-FR');
}

export default function ForumScreen({ navigation }: any) {
  const [messages, setMessages] = useState(dummyForumMessages);
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date().toISOString();
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'Vous',
        avatar: 'https://i.pravatar.cc/150?img=12',
        text: inputText.trim(),
        date: now,
      },
    ]);
    setInputText('');
    setInputHeight(40);
  };

  // grouper par jour
  const grouped = messages
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce<Record<string, typeof dummyForumMessages>>((acc, msg) => {
      const key = getDayKey(msg.date);
      if (!acc[key]) acc[key] = [];
      acc[key].push(msg);
      return acc;
    }, {});

  const sections = Object.entries(grouped); // [ [ title, data[] ], ... ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#020066" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forum AJEUTCHIM</Text>
        <TouchableOpacity>
          <Ionicons name="people-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Messages groupés dans un ScrollView */}
      <ScrollView contentContainerStyle={styles.list}>
        {sections.map(([day, data]) => (
          <View key={day}>
            <Text style={styles.sectionHeader}>{day}</Text>
            {data.map(item => {
              const isMe = item.sender === 'Vous';
              return (
                <View key={item.id} style={styles.messageRow}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  <View
                    style={[
                      styles.messageContent,
                      isMe && styles.myMessageContent,
                    ]}
                  >
                    <View style={styles.messageHeader}>
                      <Text style={styles.senderName}>{item.sender}</Text>
                      <Text style={styles.messageTime}>
                        {new Date(item.date).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.messageText,
                        isMe && styles.myMessageText,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Zone de saisie */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="attach" size={20} color="#020066" />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { height: inputHeight }]}
            placeholder="Écrire un message…"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onContentSizeChange={e =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f6fc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#020066',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerBtn: { padding: 4 },
  headerTitle: {
    color: '#F4CE23',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  list: { paddingHorizontal: 16, paddingVertical: 8 },
  sectionHeader: {
    alignSelf: 'center',
    backgroundColor: '#e0e4eb',
    color: '#666',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 8,
    fontWeight: '600',
  },

  messageRow: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },

  // Conteneur de message standard
  messageContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 1,
  },
  // Conteneur spécial pour vos messages
  myMessageContent: {
    backgroundColor: '#DCF8C6',
  },

  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderName: { fontWeight: '600', color: '#020066' },
  messageTime: { fontSize: 10, color: '#999' },

  messageText: { fontSize: 14, color: '#333', lineHeight: 20 },
  // Texte foncé pour vos messages
  myMessageText: { color: '#000' },

  attachBtn: { padding: 8 },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 56,
    backgroundColor: '#fff',
    borderRadius: 24,
    elevation: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
    minHeight: 40,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: '#020066',
    padding: 10,
    borderRadius: 20,
  },
});

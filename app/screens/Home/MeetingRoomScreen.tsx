// app/screens/Home/MeetingRoomScreen.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../../config/firebase';

export type HomeStackParamList = {
  LaunchMeeting: undefined;
  MeetingRoom: { meetingId: string; topic: string; hostId: string };
};
type Props = NativeStackScreenProps<HomeStackParamList, 'MeetingRoom'>;

type Participant = { id: string; name: string; avatar: string };

export default function MeetingRoomScreen({ route, navigation }: Props) {
  const { meetingId, topic, hostId } = route.params;
  // localId corresponds to our internal 'host'
  const localId = 'host';
  const [participants] = useState<Participant[]>([
    { id: 'host', name: 'Vous (Animateur)', avatar: 'https://i.pravatar.cc/100?img=12' },
    { id: 'p1', name: 'Alice', avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: 'p2', name: 'Bruno', avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: 'p3', name: 'Eric', avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: 'p4', name: 'Raoul', avatar: 'https://i.pravatar.cc/100?img=4' },
  ]);
  const [moderator, setModerator] = useState(localId);
  const isHost = localId === 'host'; // always true for local user
  const [showInputArea, setShowInputArea] = useState(false);

  // micros ouverts
  const [participantsMic, setParticipantsMic] = useState<Record<string, boolean>>({});
  // file de demandes
  const [raisedQueue, setRaisedQueue] = useState<string[]>([]);

  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [showModModal, setShowModModal] = useState(false);

  const toggleOwnMic = () => {
    setParticipantsMic(m => ({ ...m, [localId]: !m[localId] }));
  };

  const toggleParticipantMic = (id: string) => {
    if (!isHost && id !== moderator) return;
    setParticipantsMic(m => {
      const next = !m[id];
      return { ...m, [id]: next };
    });
    setRaisedQueue(q => q.filter(x => x !== id));
  };

  const toggleRaiseHand = (id: string) => {
    setRaisedQueue(q => (q.includes(id) ? q.filter(x => x !== id) : [...q, id]));
  };

  const assignModerator = (id: string) => {
    setModerator(id);
    setShowModModal(false);
  };

  const sendChat = () => {
    if (!chatText.trim()) return;
    setChatMessages(c => [...c, { id: Date.now().toString(), sender: 'Vous', text: chatText.trim() }]);
    setChatText('');
    setShowInputArea(false);
  };

  const endMeeting = () => navigation.goBack();

  // speaker
  const activeIds = participants.map(p => p.id).filter(id => participantsMic[id]);
  const speakerId = activeIds[0] ?? localId;
  const speaker = participants.find(p => p.id === speakerId)!;
  const isSpeaking = !!participantsMic[speakerId];

  // ordre : modérateur, demandes, autres
  const sortedParticipants = useMemo(() => {
    const mod = participants.find(p => p.id === moderator);
    const raised = raisedQueue
      .filter(id => id !== moderator)
      .map(id => participants.find(p => p.id === id)!)
      .filter(Boolean);
    const others = participants.filter(
      p => p.id !== moderator && !raisedQueue.includes(p.id)
    );
    return [...(mod ? [mod] : []), ...raised, ...others];
  }, [participants, moderator, raisedQueue]);

  useEffect(() => {
    console.log('Utilisateur connecté (uid) =', auth.currentUser?.uid);
  }, []);

  const ListHeader = () => (
    <>
      {raisedQueue.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>File d'attente parole :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {raisedQueue.map(id => {
              const p = participants.find(x => x.id === id);
              if (!p) return null;
              return (
                <View key={id} style={styles.queueItem}>
                  <Image source={{ uri: p.avatar }} style={styles.queueAvatar} />
                  <Text style={styles.queueName}>{p.name}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.videoPlaceholder}>
          <Image source={{ uri: speaker.avatar }} style={styles.speakerAvatar} />
          <Text style={styles.videoText}>
            {isSpeaking ? `${speaker.name} parle…` : 'Micro coupé'}
          </Text>
        </View>
      </View>

      <View style={[styles.card, styles.participantsCard]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sortedParticipants.map(p => {
            const didRaise = raisedQueue.includes(p.id);
            const isTalking = !!participantsMic[p.id];
            const isMod = p.id === moderator;
            return (
              <View key={p.id} style={styles.participantContainer}>
                <TouchableOpacity
                  onPress={() =>
                    isHost
                      ? toggleParticipantMic(p.id)
                      : toggleRaiseHand(p.id)
                  }
                  style={styles.participant}
                >
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: p.avatar }} style={styles.avatar} />
                    {didRaise && (
                      <Ionicons name="hand-right" size={16} color="#f39c12" style={styles.raiseIcon} />
                    )}
                    {isTalking && (
                      <View style={styles.dotsContainer}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                      </View>
                    )}
                    {isMod && (
                      <FontAwesome5 name="crown" size={16} color="#f1c40f" style={styles.crownIcon} />
                    )}
                  </View>
                  <Text style={styles.participantName}>{p.name}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleOwnMic} style={styles.controlBtn}>
          <Ionicons name={participantsMic[localId] ? 'mic' : 'mic-off'} size={28} color="#fff" />
        </TouchableOpacity>
        {!isHost && (
          <TouchableOpacity onPress={() => toggleRaiseHand(localId)} style={styles.controlBtn}>
            <Ionicons
              name="hand-right"
              size={28}
              color={raisedQueue.includes(localId) ? '#f39c12' : '#fff'}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setShowInputArea(v => !v)} style={styles.controlBtn}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={28}
            color={showInputArea ? '#4caf50' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#020066" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={endMeeting} style={styles.iconButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.topic}>{topic}</Text>
          <Text style={styles.meetingId}>ID : {meetingId}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowModModal(true)} style={styles.iconButton}>
          <Ionicons name="medal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chatMessages}
        keyExtractor={i => i.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.chatListContent}
        style={styles.chatList}
        keyboardShouldPersistTaps="handled"
        extraData={[participantsMic, raisedQueue, showInputArea]}
        renderItem={({ item }) => (
          <View style={styles.chatBubble}>
            <Text style={styles.chatSender}>{item.sender}</Text>
            <Text style={styles.chatText}>{item.text}</Text>
          </View>
        )}
      />

      {showInputArea && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.select({ ios: 90, android: 70 })}
          style={styles.inputAvoid}
        >
          <View style={styles.chatInputArea}>
            <TouchableOpacity onPress={toggleOwnMic}>
              <Ionicons
                name={participantsMic[localId] ? 'mic' : 'mic-off'}
                size={20}
                color="#020066"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.chatInput}
              placeholder="Écrire un message…"
              placeholderTextColor="#999"
              value={chatText}
              onChangeText={setChatText}
            />
            <TouchableOpacity onPress={sendChat} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <Modal visible={showModModal} transparent animationType="slide">
        <View style={styles.modalOverlay} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Maître de séance</Text>
          {participants.map(p => (
            <TouchableOpacity
              key={p.id}
              style={styles.modItem}
              onPress={() => assignModerator(p.id)}
            >
              <Text style={[styles.modName, p.id === moderator && styles.modActive]}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowModModal(false)} style={styles.modClose}>
            <Text style={styles.modCloseText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f3f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020066',
    padding: 12,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconButton: { width: 32, alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  topic: { color: '#fff', fontSize: 18, fontWeight: '600' },
  meetingId: { color: '#ccc', fontSize: 12, marginTop: 2 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },

  queueItem: { alignItems: 'center', marginRight: 12 },
  queueAvatar: { width: 32, height: 32, borderRadius: 16 },
  queueName: { fontSize: 10, marginTop: 4, color: '#333' },

  videoPlaceholder: {
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e4eb',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  speakerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4caf50',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  videoText: { marginTop: 8, color: '#888' },

  participantsCard: { paddingVertical: 8 },
  participantContainer: { paddingHorizontal: 4 },
  participant: { alignItems: 'center' },
  avatarContainer: { position: 'relative', alignItems: 'center' },
  crownIcon: { position: 'absolute', top: -6, alignSelf: 'center' },
  raiseIcon: { position: 'absolute', top: -4, right: -4 },
  dotsContainer: { flexDirection: 'row', marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4caf50', marginHorizontal: 2 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  participantName: { fontSize: 12, color: '#333', marginTop: 4 },

  controls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  controlBtn: {
    marginHorizontal: 16,
    backgroundColor: '#020066',
    padding: 14,
    borderRadius: 30,
  },

  chatList: { flex: 1, backgroundColor: '#fff' },
  chatListContent: { padding: 16 },
  chatBubble: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  chatSender: { fontWeight: '600', color: '#020066', marginBottom: 4 },
  chatText: { color: '#333' },

  inputAvoid: { backgroundColor: '#f0f3f8' },
  chatInputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ececec',
    marginHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: '#020066',
    padding: 12,
    borderRadius: 20,
    marginLeft: 8,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#020066', marginBottom: 12 },
  modItem: { paddingVertical: 10 },
  modName: { fontSize: 16, color: '#333' },
  modActive: { color: '#4caf50', fontWeight: '700' },
  modClose: { marginTop: 16, alignItems: 'center' },
  modCloseText: { color: '#999', fontSize: 16 },
});

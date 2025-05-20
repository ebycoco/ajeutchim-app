// app/screens/Home/ChatScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Dimensions,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

// Données factices de conversations, avec lastDate ISO, online/status
const dummyConversations = [
  {
    id: '1',
    name: 'Marie Dupont',
    lastMessage: 'À demain pour le meetup !',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastDate: '2025-05-04T16:45:00',
    online: true,
    messageStatus: 'read',
    unreadCount: 0,
  },
  {
    id: '2',
    name: 'Jean Kouadio',
    lastMessage: "J'ai partagé le document.",
    avatar: 'https://i.pravatar.cc/150?img=34',
    lastDate: '2025-05-03T15:22:00',
    online: false,
    messageStatus: 'sent',
    unreadCount: 3,
  },
  {
    id: '3',
    name: 'Fatou Diarra',
    lastMessage: 'Peux-tu valider mon paiement ?',
    avatar: 'https://i.pravatar.cc/150?img=56',
    lastDate: '2025-05-02T14:08:00',
    online: true,
    messageStatus: 'read',
    unreadCount: 1,
  },
];

// Données factices des membres
const bureauMembers = [
  { id: 'b1', name: 'Alice Martin', avatar: 'https://i.pravatar.cc/150?img=1', profession: 'Président' },
  { id: 'b2', name: 'Bruno Dupont', avatar: 'https://i.pravatar.cc/150?img=2', profession: 'Trésorier' },
];
const simpleMembers = [
  { id: 'm1', name: 'Carole Bernard', avatar: 'https://i.pravatar.cc/150?img=3', profession: 'Membre' },
  { id: 'm2', name: 'David Leroy', avatar: 'https://i.pravatar.cc/150?img=4', profession: 'Membre' },
];

// en dehors du composant
const initialSections = [
  { title: 'Bureau',  data: bureauMembers },
  { title: 'Membres', data: simpleMembers },
];


export default function ChatScreen() {
   const navigations = useNavigation<DrawerNavigationProp<any>>();
  const [conversations] = useState(dummyConversations);
  const navigation = useNavigation<any>();
   // État context‐menu existant...
  const [menuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef<any>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  // Nouvel état modale "Sélection membre"
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [memberSections, setMemberSections] = useState(initialSections);

  const openMemberModal = () => setShowMemberModal(true);
  const closeMemberModal = () => setShowMemberModal(false);


  const openMenu = () => {
    buttonRef.current?.measure((
      _fx: number,
      _fy: number,
      _w: number,
      h: number,
      px: number,
      py: number
    ) => {
      setMenuPos({ x: px, y: py + h });
      setMenuVisible(true);
    });
  };

  const closeMenu = () => setMenuVisible(false);

  const menuOptions = [
    {
      label: 'Bureau',
      action: () => {
        setMemberSections([{ title: 'Bureau', data: bureauMembers }]);
        openMemberModal();
      }
    },
    {
      label: 'Membres',
      action: () => {
        setMemberSections([{ title: 'Membres', data: simpleMembers }]);
        openMemberModal();
      }
    },
    { label: 'Lancer une réunion', action: () => {
      setMenuVisible(false);
      navigation.navigate('LaunchMeeting');
    }},
    { label: 'Forum du groupe', action: () => {
      setMenuVisible(false);
      navigation.navigate('Forum');
    } },
    { label: 'Paramètres', action: () => alert('Paramètres') },
  ];


  const renderConversation  = ({ item }: any) => {
    const statusIcon = item.messageStatus === 'read' ? 'checkmark-done' : 'checkmark';
    const statusColor = item.messageStatus === 'read' ? '#28a745' : '#999';
    return (
      <TouchableOpacity style={styles.chatCard} onPress={() => navigation.navigate('ChatDetail', { conversationId: item.id,conversationName: item.name, })}>
        <View>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View
            style={[
              styles.onlineBadge,
              { backgroundColor: item.online ? '#4caf50' : '#ccc' },
            ]}
          />
          {/* Badge unreadCount */}
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatTime}>
              {new Date(item.lastDate).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.chatMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            <Ionicons
              name={statusIcon}
              size={16}
              color={statusColor}
              style={styles.statusIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMember = ({ item }: { item: typeof bureauMembers[0] }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => {
        closeMemberModal();
        navigation.navigate('ChatDetail', {
          conversationId: item.id,
          conversationName: item.name,
        });
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatarModal} />
      <View>
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberProfession}>{item.profession}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#020066" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigations.toggleDrawer()} style={styles.menuButton}>
                                    <Ionicons name="menu" size={30} color="#F4CE23" />
                                </TouchableOpacity>
        <Text style={styles.headerTitle}>Messagerie</Text>
        <TouchableOpacity ref={buttonRef} onPress={openMenu}>
          <Ionicons name="ellipsis-vertical-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Context Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.overlay} onPress={closeMenu}>
          <View
            style={[
              styles.menuContainer,
              {
                top: menuPos.y,
                left: Math.min(menuPos.x, Dimensions.get('window').width - 150),
              },
            ]}
          >
            {menuOptions.map(opt => (
              <TouchableOpacity
                key={opt.label}
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  opt.action();
                }}
              >
                <Text style={styles.menuText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Liste des conversations */}
      <FlatList
        data={conversations}
        keyExtractor={i => i.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune conversation pour le moment.</Text>
        }
      />

      {/* Bouton nouveau message */}
      <TouchableOpacity style={styles.fab}  onPress={() =>{setMemberSections(initialSections);
+         openMemberModal();}}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
      </TouchableOpacity>

       {/* Modale de sélection de membre */}
       <Modal visible={showMemberModal} transparent animationType="slide">
        <Pressable style={styles.overlayModal} onPress={closeMemberModal} />
        <View style={styles.memberModal}>
          <Text style={styles.modalTitle}>Nouveau message à :</Text>
          <SectionList
            sections={memberSections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            renderItem={renderMember}
          />
        </View>
      </Modal>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
   menuButton: {
    padding: 8,
    zIndex: 1,
},
  headerTitle: { color: '#F4CE23', fontSize: 20, fontWeight: '700' },

  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 80 },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  unreadBadge:  {
    position: 'absolute',
    top: -10,
    right: -4,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText:   { color: '#fff', fontSize: 12, fontWeight: '700' },
  chatInfo: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: { fontSize: 16, fontWeight: '600', color: '#020066' },
  chatTime: { fontSize: 12, color: '#999' },
  messageRow: { flexDirection: 'row', alignItems: 'center' },
  chatMessage: { fontSize: 14, color: '#666', flex: 1 },
  statusIcon: { marginLeft: 6 },

  empty: { textAlign: 'center', marginTop: 40, color: '#666' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 2,
    backgroundColor: '#F4CE23',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  /* Context Menu */
  overlay: { flex: 1 },
  menuContainer: {
    position: 'absolute',
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    paddingVertical: 4,
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 12 },
  menuText: { fontSize: 14, color: '#333' },
  overlayModal: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
  },
  memberModal: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    maxHeight: '60%', backgroundColor: '#fff',
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18, fontWeight: '700', color: '#020066',
    marginBottom: 12, textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 16, fontWeight: '600', color: '#666',
    marginTop: 12, marginBottom: 4,
  },
  memberCard: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
  },
  avatarModal: {
    width: 40, height: 40, borderRadius: 20, marginRight: 12,
  },
  memberName: { fontSize: 16, color: '#333' },
  memberProfession: { fontSize: 14, color: '#666', marginTop: 2 },
 
});

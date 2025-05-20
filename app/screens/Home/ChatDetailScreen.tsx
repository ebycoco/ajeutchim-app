// app/screens/Home/ChatDetailScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Pressable,
    Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

// Messages factices
const dummyMessages = [
    { id: '1', text: 'Salut, comment ça va ?', date: '2025-05-04T16:46:00', sender: 'other' },
    { id: '2', text: 'Très bien merci ! Et toi ?', date: '2025-05-04T16:47:00', sender: 'me', status: 'read' },
    { id: '3', text: 'On se retrouve demain ?', date: '2025-05-03T14:20:00', sender: 'other' },
    { id: '4', text: 'Parfait, à demain.', date: '2025-05-02T10:30:00', sender: 'me', status: 'sent' },
];

// Fonction de formatage des dates
function getDayKey(iso: string) {
    const d = new Date(iso);
    const today = new Date();
    const diff = Math.floor(
        (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
            new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / (1000 * 3600 * 24)
    );
    if (diff === 0) return 'Aujourd’hui';
    if (diff === 1) return 'Hier';
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function ChatDetailScreen({ route, navigation }: any) {
    const { conversationName } = route.params;
    const [messages, setMessages] = useState(dummyMessages);
    const [lastMeId, setLastMeId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [inputHeight, setInputHeight] = useState(40);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeMsg, setActiveMsg] = useState<typeof dummyMessages[0] | null>(null);

    // À chaque fois que 'messages' change, on recalcule lastMeId
    React.useEffect(() => {
        const meMessages = messages
            .filter(m => m.sender === 'me')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLastMeId(meMessages[0]?.id ?? null);
    }, [messages]);

    const onLongPress = (msg: typeof dummyMessages[0]) => {
        setActiveMsg(msg);
        setModalVisible(true);
    };

    const handleAction = async (action: string) => {
        setModalVisible(false);
        if (!activeMsg) return;

        switch (action) {
            case 'edit':
                setInputText(activeMsg.text);
                setMessages(msgList => msgList.filter(m => m.id !== activeMsg.id));
                break;
            case 'delete':
                setMessages(msgList => msgList.filter(m => m.id !== activeMsg.id));
                break;
            case 'copy':
                await Clipboard.setStringAsync(activeMsg.text);
                break;
            case 'share':
                Share.share({ message: activeMsg.text });
                break;
        }
    };

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const now = new Date().toISOString();
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), text: inputText.trim(), date: now, sender: 'me' },
        ]);
        setInputText('');
    };

    // Trier + Grouper
    const sorted = [...messages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const grouped: Record<string, typeof dummyMessages> = {};
    sorted.forEach(m => {
        const key = getDayKey(m.date);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(m);
    });

    const sections = Object.entries(grouped).map(([day, data]) => ({ day, data }));

    const renderBubble = (item: typeof dummyMessages[0]) => {
        const isMe = item.sender === 'me';
        const time = new Date(item.date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <TouchableOpacity
                onLongPress={() => onLongPress(item)}
                activeOpacity={0.7}
                style={[styles.bubbleContainer, isMe ? styles.alignEnd : styles.alignStart]}
            >
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                    <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
                    <Text style={styles.timeText}>{time}</Text>
                    {isMe && (
                        <Ionicons
                            name={
                                item.status === 'read'
                                    ? 'checkmark-done-circle'
                                    : item.status === 'delivered'
                                        ? 'checkmark-done'
                                        : 'checkmark'
                            }
                            size={16}
                            color={item.status === 'read' ? '#4caf50' : '#999'}
                            style={{ marginLeft: 4, alignSelf: 'flex-end' }}
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };
    // On prépare dynamiquement la liste des actions à afficher
    const actionOptions = [
        { key: 'copy', label: 'Copier' },
        { key: 'share', label: 'Partager' },
        // on n’ajoute “Modifier” que si on est bien sur le dernier message “me”
        ...(activeMsg?.id === lastMeId
            ? [
                { key: 'edit', label: 'Modifier' },
                { key: 'delete', label: 'Supprimer' },
            ]
            : []),
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#020066" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{conversationName}</Text>
                <TouchableOpacity style={styles.headerBtn}>

                </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView style={styles.messagesScroll} contentContainerStyle={styles.chatList}>
                {sections.map(section => (
                    <View key={section.day}>
                        <Text style={styles.daySeparator}>{section.day}</Text>
                        {section.data.map(message => (
                            <React.Fragment key={message.id}>
                                {renderBubble(message)}
                            </React.Fragment>
                        ))}

                    </View>
                ))}
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
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
                        onContentSizeChange={e => setInputHeight(e.nativeEvent.contentSize.height)}
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Modal d'actions */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.actionMenu}>
                        {actionOptions
                            .map(opt => (
                                <TouchableOpacity key={opt.key} style={styles.actionItem} onPress={() => handleAction(opt.key)}>
                                    <Text style={styles.actionText}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f3f8' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#020066',
        padding: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: { color: '#F4CE23', fontSize: 18, fontWeight: '600' },
    headerBtn: { padding: 4 },

    messagesScroll: { flex: 1 },
    chatList: { paddingHorizontal: 12, paddingBottom: 30 },

    daySeparator: {
        alignSelf: 'center',
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#e0e4eb',
        borderRadius: 12,
        color: '#666',
    },

    bubbleContainer: { flexDirection: 'row', marginVertical: 4 },
    alignStart: { justifyContent: 'flex-start' },
    alignEnd: { justifyContent: 'flex-end' },

    bubble: { maxWidth: '75%', padding: 12, borderRadius: 16, marginHorizontal: 8, elevation: 2 },
    bubbleOther: { backgroundColor: '#fff', borderTopLeftRadius: 0 },
    bubbleMe: { backgroundColor: '#020066', borderBottomRightRadius: 0 },
    bubbleText: { fontSize: 14, color: '#333' },
    bubbleTextMe: { color: '#fff' },
    timeText: { fontSize: 10, color: '#999', marginTop: 4, alignSelf: 'flex-end' },

    inputArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 8,
        marginHorizontal: 12,
        marginBottom: 2,
        backgroundColor: '#fff',
        borderRadius: 24,
        elevation: 2,
    },
    attachBtn: { padding: 8 },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        marginHorizontal: 8,
        minHeight: 40,
        maxHeight: 120,
    },
    sendBtn: { backgroundColor: '#020066', padding: 12, borderRadius: 20 },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionMenu: {
        width: 220,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        paddingVertical: 12,
    },
    actionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    actionText: {
        fontSize: 16,
        color: '#333',
    },
});

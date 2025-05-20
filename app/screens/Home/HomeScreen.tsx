// app/screens/Home/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image,
    StatusBar,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Données dummy avec année
interface Member {
    uid: string;
    name: string;
    username: string;
    cotised: boolean;
    year: number;
}

const dummyMembers: Member[] = [
    { uid: '1', name: 'BROU', username: 'YAO ERIC', cotised: true, year: 2020 },
    { uid: '2', name: 'Kouadio', username: 'Jean', cotised: false, year: 2023 },
    { uid: '3', name: 'Diarra', username: 'Fatou', cotised: true, year: 2024 },
    { uid: '4', name: 'Koffi', username: 'Yao', cotised: false, year: 2024 },
    { uid: '5', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '6', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '7', name: 'Traoré', username: 'Aïssatou', cotised: false, year: 2025 },
    { uid: '8', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '9', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '10', name: 'Traoré', username: 'Aïssatou', cotised: false, year: 2025 },
    { uid: '11', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '12', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '13', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '14', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '15', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '16', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
    { uid: '17', name: 'Traoré', username: 'Aïssatou', cotised: true, year: 2025 },
];

export default function HomeScreen() {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [cotise, setCotise] = useState<boolean>(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [electionResults, setElectionResults] = useState<{
        title: string;
        date: string;
        winners: { name: string; votes: number }[];
    } | null>(null);


    const years = React.useMemo(() => {
        return Array.from(new Set(dummyMembers.map(m => m.year))).sort();
    }, []);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setMembers(dummyMembers);
            setSelectedYear(years[years.length - 1] || null);
            setLoading(false);
        }, 500);
    }, [years]);
    // simule vérification de la dispo des résultats
    useEffect(() => {
        // TODO: remplacer par un vrai fetch !
        setTimeout(() => {
            const resultsAvailable = true; // ou false
            if (resultsAvailable) {
                setElectionResults({
                    title: "Président de l'AJEUTCHIM",
                    date: '15 juin 2025',
                    winners: [
                        { name: 'Alice Dupont', votes: 125 },
                        { name: 'Bruno Martin', votes: 98 },
                    ],
                });
                setShowResultsModal(true);
            }
        }, 1000);
    }, []);

    const filtered = selectedYear ? members.filter(m => m.year === selectedYear) : members;

    return (
        <View style={styles.screen}>
            {/* StatusBar */}
            <StatusBar backgroundColor="#020066" barStyle="light-content" />
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
                    <Ionicons name="menu" size={30} color="#F4CE23" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tableau de Bord</Text>
                <View style={styles.menuButtonPlaceholder} />
            </View>
            <Text style={styles.email}>BROU YAO ERIC</Text>

            {/* STATUT DE COTISATION */}
            <View
                style={[
                    styles.status,
                    cotise ? styles.statusPaid : styles.statusDue
                ]}
            >
                <Ionicons
                    name={cotise ? 'checkmark-circle' : 'alert-circle'}
                    size={20}
                    color={cotise ? '#28a745' : '#dc3545'}
                />
                <Text style={[styles.statusText, cotise ? styles.textPaid : styles.textDue]}>
                    {cotise ? ' Cotisation à jour' : ' Cotisation en retard'}
                </Text>
            </View>

            {/* CARTE DE COMPTEUR */}
            <View style={styles.counterCard}>
                <Ionicons name="people" size={24} color="#020066" />
                <Text style={styles.counterText}>
                    {filtered.length} membre{filtered.length > 1 ? 's' : ''}
                </Text>
            </View>
            {/* FILTRE ANNÉE */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScrollContainer}
                contentContainerStyle={styles.filterScrollContent}
            >
                {years.map(year => {
                    const active = year === selectedYear;
                    return (
                        <TouchableOpacity
                            key={year}
                            style={[styles.filterPill, active && styles.filterPillActive]}
                            onPress={() => setSelectedYear(year)}
                        >
                            <Text style={[styles.filterText, active && styles.filterTextActive]}>
                                {year}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            {/* MODAL RÉSULTATS D'ÉLECTION */}
            <Modal
                visible={showResultsModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowResultsModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Résultats disponibles !</Text>
                        {electionResults && (
                            <>
                                <Text style={styles.modalSubtitle}>
                                    {electionResults.title} — {electionResults.date}
                                </Text>
                                {electionResults.winners.map((w, i) => (
                                    <View key={i} style={styles.modalRow}>
                                        <Text style={styles.modalWinner}>{w.name}</Text>
                                        <Text style={styles.modalVotes}>{w.votes} votes</Text>
                                    </View>
                                ))}
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowResultsModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* LISTE MEMBRES */}
            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#020066" />
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {filtered.map(m => (
                            <View key={m.uid} style={styles.card}>
                                {/* Avatar membre */}
                                <Image
                                    source={{ uri: `https://ui-avatars.com/api/?name=${m.name}+${m.username}` }}
                                    style={styles.cardAvatar}
                                />
                                {/* Infos membre */}
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardName}>{m.name} {m.username}</Text>
                                    <Text style={styles.cardUsername}>0757401657</Text>
                                </View>
                                {/* Statut */}
                                <Ionicons
                                    name={m.cotised ? 'checkmark-circle' : 'alert-circle'}
                                    size={24}
                                    color={m.cotised ? '#28a745' : '#dc3545'}
                                />
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
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
    counterCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    counterText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#020066',
    },

    menuButton: {
        padding: 8,
        zIndex: 1,
    },
    menuButtonPlaceholder: {
        width: 32,
    },
    filterScrollContainer: {
        height: 40,
        marginHorizontal: 16,
        marginTop: -180,
    },
    filterScrollContent: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    headerTitle: {
        color: '#F4CE23',
        fontSize: 20,
        fontWeight: '700',
    },
    email: {
        color: '#020066',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 16,
        borderRadius: 20,
    },
    statusPaid: {
        backgroundColor: '#e6f4ea',  // vert clair
    },
    statusDue: {
        backgroundColor: '#fcebea',  // rouge clair
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    textPaid: {
        color: '#28a745',  // vert
    },
    textDue: {
        color: '#dc3545',  // rouge
    },

    filterScroll: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        flexDirection: 'row',
    },
    filterPill: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#e6e9ef',
        borderRadius: 20,
        marginRight: 8,
    },
    filterPillActive: {
        backgroundColor: '#020066',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    filterTextActive: {
        color: '#fff',
    },
    listContainer: {
        marginTop: -199,
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 16,
        marginBottom: 5,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    cardName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#020066',
    },
    cardUsername: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 4,
    },
    /* Modal styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 6,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#020066',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 4,
    },
    modalWinner: { fontSize: 16, fontWeight: '600', color: '#020066' },
    modalVotes: { fontSize: 16, color: '#555' },
    modalButton: {
        marginTop: 24,
        backgroundColor: '#F4CE23',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    modalButtonText: {
        color: '#020066',
        fontWeight: '700',
        fontSize: 16,
    },
});

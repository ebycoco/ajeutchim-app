// app/screens/Home/ElectionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Candidate = {
  id: string;
  name: string;
  party: string;
  votes: number;
  avatar: string;
  color: string;
};

type Election = {
  id: string;
  title: string;
  date: string;
  candidates: Candidate[];
};

const mockElections: Election[] = [
  {
    id: 'e1',
    title: "Président de l'AJEUTCHIM",
    date: '15 juin 2025',
    candidates: [
      { id: 'c1', name: 'Alice Dupont', party: 'Parti A', votes: 125, avatar: 'https://i.pravatar.cc/100?img=1', color: '#e74c3c' },
      { id: 'c2', name: 'Bruno Martin', party: 'Parti B', votes: 98,  avatar: 'https://i.pravatar.cc/100?img=2', color: '#3498db' },
      { id: 'c3', name: 'Chantal Simon', party: 'Parti C', votes: 76,  avatar: 'https://i.pravatar.cc/100?img=3', color: '#f1c40f' },
    ],
  },
  {
    id: 'e2',
    title: 'Trésorier',
    date: '15 juin 2025',
    candidates: [
      { id: 'c4', name: 'Eric Lemaire', party: 'Parti A', votes: 140, avatar: 'https://i.pravatar.cc/100?img=4', color: '#e74c3c' },
      { id: 'c5', name: 'Fabrice Noël', party: 'Parti B', votes: 80,  avatar: 'https://i.pravatar.cc/100?img=5', color: '#3498db' },
    ],
  },
  {
    id: 'e3',
    title: 'Commissaire aux comptes',
    date: '15 juin 2025',
    candidates: [
      { id: 'c6', name: 'Raoul Petit', party: 'Indépendant', votes: 90,  avatar: 'https://i.pravatar.cc/100?img=6', color: '#9b59b6' },
      { id: 'c7', name: 'Philomène Durand', party: '', votes: 110, avatar: 'https://i.pravatar.cc/100?img=7', color: '#2ecc71' },
    ],
  },
];

export default function ElectionScreen() {
  const isAdvisor = true;
  const [elections, setElections] = useState<Election[]>(mockElections);
  const [votedMap, setVotedMap] = useState<Record<string, string>>({});
  const [showResultsMap, setShowResultsMap] = useState<Record<string, boolean>>({});

  const totalVotes = (cands: Candidate[]) =>
    cands.reduce((sum, c) => sum + c.votes, 0);

  const castVote = (eId: string, cId: string) => {
    if (votedMap[eId]) {
      Alert.alert('Attention', 'Vous avez déjà voté pour cette élection.');
      return;
    }
    setElections(prev =>
      prev.map(el =>
        el.id === eId
          ? {
              ...el,
              candidates: el.candidates.map(c =>
                c.id === cId ? { ...c, votes: c.votes + 1 } : c
              ),
            }
          : el
      )
    );
    setVotedMap(m => ({ ...m, [eId]: cId }));
    Alert.alert('Merci', 'Votre vote a été enregistré.');
  };

  const toggleResults = (eId: string) => {
    setShowResultsMap(m => ({ ...m, [eId]: !m[eId] }));
  };

  const publishResults = (title: string) => {
    Alert.alert('Résultats publiés', `Les résultats de « ${title} » sont désormais publics.`);
  };

  const renderCandidate = (election: Election) => ({ item }: { item: Candidate }) => {
    const total = totalVotes(election.candidates);
    const pct = total > 0 ? (item.votes / total) * 100 : 0;
    const show = showResultsMap[election.id];
    const votedForThis = votedMap[election.id] === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.candidateCard,
          votedForThis && { borderColor: item.color, borderWidth: 2 }
        ]}
        onPress={() => castVote(election.id, item.id)}
        activeOpacity={0.8}
        disabled={!!votedMap[election.id]}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          {item.party.length > 0 && (
            <Text style={[styles.party, { backgroundColor: item.color + '33' }]}>
              {item.party}
            </Text>
          )}
          {show && (
            <View style={styles.voteInfo}>
              <Text style={styles.pctText}>{Math.round(pct)}%</Text>
              <Text style={styles.voteCount}>{item.votes} voix</Text>
            </View>
          )}
        </View>
        {votedForThis && (
          <View style={[styles.choiceBadge, { backgroundColor: item.color }]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.choiceText}>Votre choix</Text>
          </View>
        )}
        {!show && !votedMap[election.id] && (
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        )}
      </TouchableOpacity>
    );
  };

  const renderElection = ({ item }: { item: Election }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.title}</Text>
        {isAdvisor && (
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => toggleResults(item.id)}
          >
            <Text style={styles.toggleText}>
              {showResultsMap[item.id] ? 'Masquer' : 'Afficher'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.instructionText}>
              Sélectionnez un candidat pour voter
            </Text>
      <FlatList
        data={item.candidates}
        keyExtractor={c => c.id}
        renderItem={renderCandidate(item)}
      />
      {isAdvisor && showResultsMap[item.id] && (
        <TouchableOpacity
          style={styles.publishBtn}
          onPress={() => publishResults(item.title)}
        >
          <Text style={styles.publishText}>Publier résultats</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    
    <FlatList
      data={elections}
      keyExtractor={e => e.id}
      renderItem={renderElection}
      contentContainerStyle={styles.list}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa',marginBottom:35, },
  list: { padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#333' },
  date: { fontSize: 14, color: '#666', marginBottom: 12 },

  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#020066',
  },
  toggleText: { color: '#fff', fontWeight: '600' },

  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 12,
    padding: 8,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#222' },
  party: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    color: '#222',
    fontSize: 12,
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  voteInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  pctText: { fontWeight: '600', color: '#555', marginRight: 8 },
  voteCount: { fontSize: 12, color: '#888' },

  choiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  choiceText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },

  publishBtn: {
    marginTop: 16,
    backgroundColor: '#f4ce23',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  publishText: { fontWeight: '600', color: '#020066', fontSize: 16 },
});

// app/screens/Home/DocumentDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DocumentsStackParamList } from '../../navigation/DocumentsStackNavigator';

// Importez votre logo
const logo = require('../../../assets/logo.png');

type Props = NativeStackScreenProps<DocumentsStackParamList, 'DocumentDetail'>;

// Définitions fictives des articles
const articlesByDoc: Record<'statuts' | 'reglements', { id: string; title: string; content: string }[]> = {
  statuts: [
    { id: 'art1', title: 'Article 1 – Dénomination', content: 'L\'association est dénommée "AJEUTCHIM".' },
    { id: 'art2', title: 'Article 2 – Objet', content: 'Elle a pour objet de promouvoir ...' },
    { id: 'art3', title: 'Article 3 – Siège social', content: 'Le siège est fixé à ...' },
    { id: 'art4', title: 'Article 3 – Siège social', content: 'Le siège est fixé à ...' },
    { id: 'art5', title: 'Article 3 – Siège social', content: 'Le siège est fixé à ...' },
    { id: 'art6', title: 'Article 3 – Siège social', content: 'Le siège est fixé à ...' },
    { id: 'art7', title: 'Article 3 – Siège social', content: 'Le siège est fixé à ...' },
    { id: 'art8', title: 'Article 3 – Siège social', content: 'Le siège est fixé à ...' },
    { id: 'art9', title: 'Article 3 – Siège social', content: 'Le siège est fixé à JSJGHIJDHGKIJDFBKIJSDHFSDDHBDFSHBVLIHDBVIHDFVDF DBDFBVJDFBVJDSJBVDSJV  JDFSJBVJDFNVDFNLV NJBDFBDFNDF ?NVJBDFJNDFIDF nipiohijnion nbnfndfndf  jbnjoldf' },
  ],
  reglements: [
    { id: 'chap1', title: 'Chapitre I – Admission', content: 'Tout membre doit ...' },
    { id: 'chap2', title: 'Chapitre II – Cotisations', content: 'Le montant annuel est de ...' },
    { id: 'chap3', title: 'Chapitre III – Discipline', content: 'Tout manquement ...' },
  ],
};

export default function DocumentDetailScreen({ navigation, route }: Props) {
  const { docId, title } = route.params;
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Simule un délai de chargement
    const timer = setTimeout(() => {
      if (docId === 'statuts' || docId === 'reglements') {
        // pas de contenu global, on gère via articlesByDoc
        setContent('');
      } else {
        // contenu libre pour autres documents
        setContent(
          docId === 'bilan2024'
            ? 'Bilan financier 2024\n\nRecettes : 45 000€\nDépenses : 38 500€\nSolde : +6 500€'
            : docId === 'rapportActivite'
            ? 'Rapport d’activité annuel\n\n• Janvier – Lancement...\n• Mars – Événement...\n• Décembre – Clôture...'
            : 'Contenu indisponible.'
        );
      }
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [docId]);

  const toggleExpand = (id: string) => {
    setExpandedIds(s => {
      const copy = new Set(s);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#020066" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo en fond */}
       <Image source={logo} style={styles.logoBackground} />
        {docId === 'statuts' || docId === 'reglements' ? (
          // Affiche la liste d'articles
          articlesByDoc[docId as 'statuts' | 'reglements'].map(article => {
            const isOpen = expandedIds.has(article.id);
            return (
              <View key={article.id} style={styles.accordionCard}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleExpand(article.id)}
                >
                  <Text style={styles.accordionTitle}>{article.title}</Text>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#020066"
                  />
                </TouchableOpacity>
                {isOpen && <Text style={styles.accordionContent} selectable>{article.content}</Text>}
              </View>
            );
          })
        ) : (
          // Autres documents : contenu libre
          <View style={styles.contentCard}>
            <Text style={styles.content}selectable>{content}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1,
    backgroundColor: '#f5f7fa',
    marginBottom:35,
    position: 'relative',
  },
  logoBackground: {
    position: 'absolute',
    top: 20,
    right: -120,
    width: 600,
    height: 600,
    opacity: 0.2,
    resizeMode: 'contain',
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020066',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#fff3',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1,
  },
  backBtn: { marginRight: 12 },
  headerTitle: { 
    flex: 1,
    color: '#F4CE23',
    fontSize: 18,
    fontWeight: '600',
  },

  loader: {
    flex: 1,
    backgroundColor: '#020066',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: 16,
    backgroundColor: '#f5f7fa',
    zIndex: 1,
    
  },

  accordionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#e0e4eb',
    
    
  },
  accordionTitle: { fontSize: 16, fontWeight: '600', color: '#020066' },
  accordionContent: {
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    backgroundColor: '#fff',
  },

  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

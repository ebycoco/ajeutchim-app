// app/screens/Home/DocumentsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DocumentsStackParamList } from '../../navigation/DocumentsStackNavigator';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

// Import de l’image par défaut
const defaultDocImage = require('../../../assets/default-doc.png');

type DocMeta = {
  id: string;
  title: string;
  thumbnail?: string;
};

type Props = NativeStackScreenProps<DocumentsStackParamList, 'DocumentsList'>;

export default function DocumentsScreen({ navigation }: Props) {
  const navigations = useNavigation<DrawerNavigationProp<any>>();
  const mockDocs: DocMeta[] = [
    { id: 'statuts', title: 'Statuts de l’AJEUTCHIM', thumbnail: 'https://example.com/statuts.png'  },
    { id: 'reglements', title: 'Règlement intérieur', thumbnail: 'https://example.com/reglements.png'  },
    { id: 'bilan2024', title: 'Bilan financier 2024' },
    { id: 'rapportActivite', title: 'Rapport d’activité annuel' },
  ];
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDocs(mockDocs);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#020066" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#020066" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigations.toggleDrawer()} style={styles.menuButton}>
                                            <Ionicons name="menu" size={30} color="#F4CE23" />
                                        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents AJEUTCHIM</Text>
      </View>
      <FlatList
        data={docs}
        keyExtractor={d => d.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('DocumentDetail', {
                docId: item.id,
                title: item.title,
              })
            }
          >
             {/* Miniature ou image par défaut */}
             <View style={styles.iconWrapper}>
              <Image
                source={ item.thumbnail ? { uri: item.thumbnail } : defaultDocImage }
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#bbb"
              style={styles.chevron}
            />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun document disponible.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  container: {
    padding: 16,
    backgroundColor: '#f5f7fa',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  textWrapper: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  chevron: { marginLeft: 8 },

  separator: { height: 12 },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontStyle: 'italic',
  },
});

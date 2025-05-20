// app/screens/Home/PaymentsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

type Payment = {
  id: string;
  date: string;
  amount: number;
  status: 'Payé' | 'En attente';
  receipt?: string;
};

const dummyPayments: Payment[] = [
  { id: '1', date: '2025-01-15', amount: 500, status: 'Payé' },
  { id: '2', date: '2025-03-22', amount: 300, status: 'En attente' },
  { id: '3', date: '2024-11-05', amount: 1000, status: 'Payé' },
];

const years = Array.from(
  new Set(dummyPayments.map(p => +p.date.split('-')[0]))
).sort((a, b) => b - a);

const months = [
  { label: 'Janvier', value: 1 },
  { label: 'Février', value: 2 },
  { label: 'Mars', value: 3 },
  { label: 'Avril', value: 4 },
  { label: 'Mai', value: 5 },
  { label: 'Juin', value: 6 },
  { label: 'Juillet', value: 7 },
  { label: 'Août', value: 8 },
  { label: 'Septembre', value: 9 },
  { label: 'Octobre', value: 10 },
  { label: 'Novembre', value: 11 },
  { label: 'Décembre', value: 12 },
];

export default function PaymentsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [payments, setPayments] = useState<Payment[]>(dummyPayments);
  const [selectedYear, setSelectedYear] = useState<number>(
    years[0] || new Date().getFullYear()
  );
  // selectedMonth === null → tous les mois
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Pour le nouveau paiement
  const [newDate, setNewDate] = useState<Date>(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);

  // filtre sur année ET (si précisé) sur mois
  const filtered = payments.filter(p => {
    const [yr, mo] = p.date.split('-').map(Number);
    return (
      yr === selectedYear &&
      (selectedMonth === null || mo === selectedMonth)
    );
  });

  const handleDelete = (id: string) =>
    Alert.alert('Confirmation', 'Supprimer ce paiement ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => setPayments(prev => prev.filter(x => x.id !== id)),
      },
    ]);

  const pickReceipt = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        'Nous avons besoin de la permission pour accéder à la galerie.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const handleConfirmDate = (date: Date) => {
    setDatePickerVisible(false);
    setNewDate(date);
  };

  const addPayment = () => {
    if (!newAmount) {
      return Alert.alert('Erreur', 'Veuillez saisir un montant.');
    }
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    const newPay: Payment = {
      id: Date.now().toString(),
      date: iso,
      amount: +newAmount,
      status: 'En attente',
      receipt: receiptUri || undefined,
    };
    setPayments(prev => [newPay, ...prev]);
    setModalVisible(false);
    setNewAmount('');
    setReceiptUri(null);
    setNewDate(new Date());
  };

  const renderItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardAmount}>
          {item.amount.toLocaleString()} F CFA
        </Text>
        {item.receipt && (
          <Image source={{ uri: item.receipt }} style={styles.receiptThumb} />
        )}
      </View>
      <View style={styles.cardRight}>
        <Text
          style={[
            styles.cardStatus,
            item.status === 'Payé' ? styles.paid : styles.pending,
          ]}
        >
          {item.status}
        </Text>
        {item.status === 'En attente' && (
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#020066" barStyle="light-content" />

      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
                            <Ionicons name="menu" size={30} color="#F4CE23" />
                        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Paiements</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={28} color="#F4CE23" />
        </TouchableOpacity>
      </View>

      {/* Filtres Année & Mois */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={styles.filterText}>{selectedYear}</Text>
          <Ionicons name="chevron-down" size={16} color="#020066" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setMonthModalVisible(true)}
        >
          <Text style={styles.filterText}>
            {selectedMonth === null
              ? 'Tous'
              : months.find(m => m.value === selectedMonth)?.label}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#020066" />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun paiement trouvé.</Text>
        }
      />

      {/* Modal Sélection Année */}
      <Modal visible={yearModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setYearModalVisible(false)}
        >
          <View style={styles.modalList}>
            <ScrollView>
              {years.map(y => (
                <TouchableOpacity
                  key={y}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedYear(y);
                    setYearModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Sélection Mois */}
      <Modal visible={monthModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMonthModalVisible(false)}
        >
          <View style={styles.modalList}>
            <ScrollView>
              {/* Tous les mois */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedMonth(null);
                  setMonthModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>Tous</Text>
              </TouchableOpacity>
              {months.map(m => (
                <TouchableOpacity
                  key={m.value}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedMonth(m.value);
                    setMonthModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Nouveau Paiement */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nouveau Paiement</Text>
            <TouchableOpacity
              style={styles.modalDateBtn}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.modalDateText}>
                {newDate.toISOString().split('T')[0]}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={() => setDatePickerVisible(false)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Montant"
              keyboardType="numeric"
              value={newAmount}
              onChangeText={setNewAmount}
            />
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={pickReceipt}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.uploadText}>
                {receiptUri ? 'Reçu sélectionné' : 'Uploader reçu'}
              </Text>
            </TouchableOpacity>
            {receiptUri && (
              <Image
                source={{ uri: receiptUri }}
                style={styles.receiptPreview}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={addPayment}
              >
                <Text style={styles.modalSaveText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
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

  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    elevation: 1,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e9ef',
    padding: 8,
    borderRadius: 20,
  },
  filterText: { color: '#020066', fontWeight: '600', marginRight: 4 },

  list: { paddingHorizontal: 16, paddingBottom: 80 },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  cardDate: { color: '#999' },
  receiptThumb: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
    marginVertical: 10,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#020066',
    marginTop: 4,
  },
  cardRight: { alignItems: 'flex-end' },
  cardStatus: { fontSize: 14, fontWeight: '600' },
  paid: { color: '#28a745' },
  pending: { color: '#dc3545' },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  modalList: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 12,
    maxHeight: '50%',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: { fontSize: 16, color: '#333' },

  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 'auto',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#020066',
    textAlign: 'center',
  },
  modalDateBtn: {
    backgroundColor: '#e6e9ef',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  modalDateText: { fontSize: 16, color: '#333' },
  modalInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020066',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadText: { color: '#fff', marginLeft: 8 },

  receiptPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'center',
  },

  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtnCancel: { padding: 10, marginRight: 8 },
  modalCancelText: { color: '#666' },
  modalBtnSave: {
    backgroundColor: '#020066',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalSaveText: { color: '#fff' },
});

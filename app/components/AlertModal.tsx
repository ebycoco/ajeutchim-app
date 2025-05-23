// app/components/AlertModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AlertModalProps = {
  visible: boolean;
  type: 'info' | 'success' | 'error';
  message: string;
  onClose: () => void;
};

export default function AlertModal({ visible, type, message, onClose }: AlertModalProps) {
  const iconName = {
    info:    'information-circle-outline',
    success: 'checkmark-circle-outline',
    error:   'close-circle-outline',
  }[type];

  const color = {
    info:    '#0277BD',   // bleu
    success: '#2E7D32',   // vert
    error:   '#C62828',   // rouge
  }[type];

  // pour une petite animation d’apparition
  const scale = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (visible) {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    } else {
      scale.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.backdrop}>
        <Animated.View style={[styles.box, { transform: [{ scale }] }]}>
          <Ionicons name={iconName as any} size={48} color={color} />
          <Text style={[styles.message, { color }]}>{message}</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:           1,
    backgroundColor:'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems:     'center',
  },
  box: {
    width:           '80%',
    backgroundColor: '#fff',
    borderRadius:    12,
    padding:         24,
    alignItems:      'center',
    shadowColor:     '#000',
    shadowOpacity:   0.2,
    shadowOffset:    { width:0, height:2 },
    shadowRadius:    6,
    elevation:       5,
  },
  message: {
    marginTop:     16,
    fontSize:      16,
    textAlign:     'center',
    fontWeight:    '500',
  },
  button: {
    marginTop:       24,
    paddingHorizontal:24,
    paddingVertical:  12,
    borderRadius:    8,
  },
  buttonText: {
    color:       '#fff',
    fontWeight:  '700',
    fontSize:    16,
  },
});

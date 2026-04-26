import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SortedCars from "./SortedCars";
import { X } from "lucide-react-native";
import type { CarFilters } from "../../../../api/carsService";

export interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  sortOptionId: string;
  updateSort: <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => void;
  onApply: () => void;
}

export const SortModal = ({ visible, onClose, sortOptionId, updateSort, onApply }: SortModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.backdrop} 
          onPress={onClose} 
        />
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Sort by</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#94a3b8" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
            <SortedCars
              value={sortOptionId}
              onChange={(val) => updateSort('sortType', val)}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onApply}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Show Sorting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#020617',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    elevation: 24,
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 99,
    backgroundColor: '#1e293b',
  },
  body: {
    maxHeight: 400,
  },
  scrollContent: {
    padding: 24,
  },
  footer: {
    padding: 24,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
});
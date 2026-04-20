import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Math.max(1, totalPages);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onPageChange(1)}
        disabled={currentPage <= 1}
        style={[styles.iconButton, currentPage <= 1 && styles.disabled]}
      >
        <MaterialCommunityIcons name="chevron-double-left" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        style={[styles.textButton, currentPage <= 1 && styles.disabled]}
      >
        <Entypo name="chevron-left" size={20} color="#fff" />
        <Text style={styles.buttonText}>Prev</Text>
      </TouchableOpacity>

      <View style={styles.pageIndicator}>
        <Text style={styles.infoText}>
          <Text style={styles.activePage}>{currentPage}</Text> / {pages}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= pages}
        style={[styles.textButton, currentPage >= pages && styles.disabled]}
      >
        <Text style={styles.buttonText}>Next</Text>
        <Entypo name="chevron-right" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPageChange(pages)}
        disabled={currentPage >= pages}
        style={[styles.iconButton, currentPage >= pages && styles.disabled]}
      >
        <MaterialCommunityIcons name="chevron-double-right" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pageIndicator: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 60,
    alignItems: 'center',
  },
  infoText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  activePage: {
    color: '#70FFE2',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.3,
  },
});

export default Pagination;
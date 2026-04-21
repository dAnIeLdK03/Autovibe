import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface NoCarsFoundProps {
  onOpenFilters: () => void;
  onResetFilters: () => void;
}

export function NoCarsFound({ onOpenFilters, onResetFilters }: NoCarsFoundProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <View style={styles.glow} />
        <MaterialCommunityIcons 
          name="magnify-remove-outline" 
          size={64} 
          color="#64748b" 
        />
      </View>

      <Text style={styles.title}>No cars found</Text>
      
      <Text style={styles.subtitle}>
        We found nothing that matches the current filters.
        Try changing the criteria or resetting your search.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onOpenFilters}
          activeOpacity={0.8}
        >
          <Feather name="filter" size={18} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Change filters</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={onResetFilters}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Clear all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1e293b',
    borderStyle: 'dashed',
    marginVertical: 20,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'column', 
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 220,
    // Shadow за iOS
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    width: '100%',
    maxWidth: 220,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 16,
  },
});
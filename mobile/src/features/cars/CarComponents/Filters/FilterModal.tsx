import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur'; 
import { CarFilters } from '../../../../api/carsService';
import { initialFilters } from '../../CarList/constants';
import { BaseSelect } from './BaseSelect';
import { bodyTypes, fuelTypeOptions, MileageTypes, transmissionTypes, wheelTypes } from '../../../../api/carOptions';
import { Power } from './Power';
import { Location } from './Location';
import { YearRangeFilter } from './YearRangeFilter';

interface FilterProps {
    isOpen: boolean;
    onClose: () => void;
    filters: CarFilters;
    onApply: (finalFilters: CarFilters) => void;
};

export const FilterModal = ({ isOpen, onClose, filters, onApply }: FilterProps) => {
    const [tempFilters, setTempFilters] = useState<CarFilters>(filters);

    const handleReset = () => {
        setTempFilters(initialFilters);
    }
    
    if (!isOpen) return null;

    const localUpdate = <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => {
        setTempFilters(prev => {
            const isSameValue = prev[key] === value;
            return {
                ...prev,
                [key]: isSameValue ? "" : value
            };
        });
    };

   return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.backdropPress} onPress={onClose} />
        </BlurView>

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContent}>
            
            <ScrollView 
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Advanced Filters</Text>

              <View style={styles.sectionCard}>
                <BaseSelect
                  label='Transmission'
                  value={tempFilters.transmission ?? ""}
                  options={transmissionTypes}
                  onChange={(val) => localUpdate('transmission', val)}
                />
                <View style={styles.divider} />
                <BaseSelect
                  label='Body Type'
                  value={tempFilters.bodyType ?? ""}
                  options={bodyTypes}
                  onChange={(val) => localUpdate('bodyType', val)}
                />
                <View style={styles.divider} />
                <BaseSelect
                  label='Fuel Type'
                  value={tempFilters.fuelType ?? ""}
                  options={fuelTypeOptions}
                  onChange={(val) => localUpdate('fuelType', val)}
                />
                <View style={styles.divider} />
                <BaseSelect
                  label='Steering Wheel'
                  value={tempFilters.steeringWheel ?? ""}
                  options={wheelTypes}
                  onChange={(val) => localUpdate('steeringWheel', val)}
                />
              </View>

              <View style={styles.sectionCard}>
                <BaseSelect
                  label='Mileage'
                  value={tempFilters.mileage ?? ""}
                  options={MileageTypes}
                  onChange={(val) => localUpdate('mileage', val)}
                />
                <View style={styles.divider} />
                <Power
                  value={tempFilters.power ?? ""}
                  onChange={(val) => localUpdate('power', val)}
                />
                <View style={styles.divider} />
                <Location
                  value={tempFilters.location ?? ""}
                  onChange={(val) => localUpdate('location', val)}
                />
              </View>

              <View style={styles.sectionCard}>
                <YearRangeFilter
                  value={tempFilters.yearRange}
                  onFilterChange={(newRange) => localUpdate('yearRange', newRange)}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={handleReset}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={() => onApply(tempFilters)}
                >
                  <Text style={styles.applyButtonText}>Show results</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropPress: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalContent: {
    backgroundColor: '#020617',
    width: '100%',
    maxHeight: '90%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    overflow: 'hidden',
  },
  scrollBody: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    gap: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
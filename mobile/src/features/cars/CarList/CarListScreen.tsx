import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { useCarList } from './useCarList';
import { initialFilters } from './constants';
import CarCard from '../CarComponents/CarCard';
import { NoCarsFound } from '../../../shared/UX/NoCarsFound'; 
// import { SortModal } from '../CarComponents/Filters/SortModal'; 
// import { FilterModal } from '../CarComponents/Filters/FilterModal';

const CarListScreen = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const {
    cars, loading, error, filters, page, totalPages, handleApplyFilters,
    handleUpdateSort, handleReset, handlePageChange
  } = useCarList(initialFilters);

  if (loading && page === 1) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#70FFE2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CarCard car={item} showDeletebutton={false} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              Explore Our <Text style={{ color: '#70FFE2' }}>Fleet</Text>
            </Text>
            <Text style={styles.subtitle}>
              Discover the perfect ride for your next journey.
            </Text>

            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsSortOpen(true)}
              >
                <Text style={styles.buttonText}>Sort By</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsFilterOpen(true)}
              >
                <Text style={styles.buttonText}>Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <NoCarsFound 
            onOpenFilters={() => setIsFilterOpen(true)} 
            onResetFilters={handleReset} 
          />
        }
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
            <View style={{ paddingBottom: 40 }}>
                {/* Твоят Pagination компонент */}
            </View>
        }
      />

      {/* Тук ще рендерваш SortModal и FilterModal */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 80,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 14,
  },
  errorBox: {
    padding: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
  }
});

export default CarListScreen;
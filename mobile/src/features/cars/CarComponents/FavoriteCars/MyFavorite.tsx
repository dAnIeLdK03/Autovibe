import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useMyFavorite } from "./useMyFavoriteCars";
import CarCard from "../CarCard";
import { SkeletonLoader } from '../../../../shared/UX/SkeletonLoading';
import EmptyState from "../../../../shared/UX/EmptyState";
import Pagination from "../../../../shared/Pagination/pagePagination";

function MyFavorite() {
  const {
    cars, 
    loading, 
    error, 
    page, 
    totalPages, 
    setPage,
    refresh
  } = useMyFavorite();

  if (loading && page === 1) {
    return (
      <View style={styles.centerContainer}>
        <SkeletonLoader type="details" count={3} />
      </View>
    );
  }

  if (!loading && cars.length === 0) {
    return <EmptyState />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              My <Text style={styles.highlight}>Favorite Cars</Text>
            </Text>
            <Text style={styles.subtitle}>
              Manage your listings ({cars.length} {cars.length === 1 ? "ad" : "ads"})
            </Text>
            
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CarCard car={item} />
          </View>
        )}
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.paginationWrapper}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage: number) => setPage(newPage)}
              />
            </View>
          ) : null
        }
        onRefresh={refresh}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
  },
  highlight: {
    color: '#70FFE2',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  paginationWrapper: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default MyFavorite;
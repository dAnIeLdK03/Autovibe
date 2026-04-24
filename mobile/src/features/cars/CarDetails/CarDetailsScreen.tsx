import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSelector } from "react-redux";
import type { RootState } from "../../../stores/store";
import { useCarDetails } from "./useCarDetails";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";

import CarGallery from "./CarGallery";
import CarDetailsInfo from "./CarDetailsInfo";
import { ActivityIndicator } from 'react-native'; 
import { SkeletonLoader } from '../../../shared/UX/SkeletonLoading';

export default function CarDetails() {
  const { car, isOwner, handleDelete } = useCarDetails();
  const { loading, error } = useSelector((state: RootState) => state.cars);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <SkeletonLoader type="card" />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (car === null) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.whiteText}>Car not found.</Text>
      </View>
    );
  }
return(
  <SafeAreaView style={styles.container}>
  <View style={styles.topBar}>
    <TouchableOpacity
      style={styles.floatingBackButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    
    <Text style={styles.headerPrice}>{car.price.toLocaleString()}€</Text>
  </View>

  <ScrollView
    contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.mainWrapper}>
      <View style={styles.headerArea}>
        <Text style={styles.title} numberOfLines={2}>
          {car.make} {car.model} {car.year}
        </Text>
      </View>

      <View style={styles.galleryArea}>
        <CarGallery
          imageUrls={car.imageUrls}
          make={car.make}
          model={car.model}
          year={car.year}
        />
      </View>

      <CarDetailsInfo
        car={car}
        isOwner={isOwner}
        handleDelete={handleDelete}
      />
    </View>
  </ScrollView>
</SafeAreaView>
)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 45 : 10, 
    paddingBottom: 10,
    zIndex: 10,
  },
  floatingBackButton: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(71, 85, 105, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 14,
  },
  headerPrice: {
    color: '#70FFE2',
    fontWeight: '800',
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 40,
  },
  mainWrapper: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  headerArea: {
    marginBottom: 15,
    marginTop: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  galleryArea: {
    marginTop: 0,
    borderRadius: 24,
    overflow: 'hidden',
  },
  whiteText: {
    color: 'white',
    fontSize: 18,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    margin: 20,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
});
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../../../utils/getImageurl';
//import { FavoriteButton } from './FavoriteCars/FavoriteButton';
import { CarCardProps } from '../../../api/carsService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

const { width } = Dimensions.get('window');

const CarCard: React.FC<CarCardProps> = ({ car, onDeleteClick, showDeletebutton }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const showDeleteBtn = showDeletebutton === true;

    const handlePress = () => {
        navigation.navigate('CarDetails', { id: car.id });
    };

    return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        {car.imageUrls && car.imageUrls.length > 0 ? (
          <Image
            source={{ uri: getImageUrl(car.imageUrls[0]) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
        
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{car.year}</Text>
        </View>

        {/* <View style={styles.favoriteContainer}>
          <FavoriteButton carId={car.id} />
        </View>
       */}
        </View>

      {/* Информация */}
      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.makeText}>{car.make}</Text>
            <Text style={styles.modelText}>{car.model}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>€{car.price.toLocaleString()}</Text>
            <Text style={styles.priceLabel}>PRICE</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {car.shortDescription || "No description available for this premium vehicle."}
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.detailsBtn} 
            onPress={handlePress}
          >
            <Text style={styles.btnText}>Details</Text>
          </TouchableOpacity>

          {showDeleteBtn && (
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => onDeleteClick?.(car.id)}
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800/50
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    imageContainer: {
        height: 200,
        width: '100%',
        position: 'relative',
        backgroundColor: '#1e293b',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#334155',
    },
    placeholderText: {
        color: '#64748b',
        fontSize: 14,
    },
    yearBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    yearText: {
        color: '#70FFE2',
        fontSize: 12,
        fontWeight: 'bold',
    },
    favoriteContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    infoContainer: {
        padding: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    makeText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    modelText: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '500',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceText: {
        color: '#70FFE2',
        fontSize: 22,
        fontWeight: '900',
    },
    priceLabel: {
        color: '#475569',
        fontSize: 10,
        letterSpacing: 1,
    },
    description: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    detailsBtn: {
        flex: 1,
        backgroundColor: '#334155',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default CarCard;
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native'; 
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../stores/store";
import { toggleFavorite } from "../../../../stores/favoritesSlice";
import Toast from "react-native-toast-message";

interface Props {
  carId: number;
}

export const FavoriteButton = ({ carId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isFavorite = useSelector((s: RootState) => s.favorites.ids.includes(carId));

  const handleToggle = () => {

    if (!isAuthenticated) {
      Toast.show({
        type: 'error',
        text1: 'Login Required',
        text2: 'Please log in to save favorites.'
      });
      return;
    }

    dispatch(toggleFavorite({ carId, isFavorite }));
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
      style={styles.button}
    >
      <Heart
        size={28}
        color={isFavorite ? '#ef4444' : '#94a3b8'} 
        fill={isFavorite ? '#ef4444' : 'transparent'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, setError, setLoading } from "../../../stores/carsSlice";
import { deleteCar, getCarById, type CarDetails } from "../../../api/carsService";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootState } from "../../../stores/store";
import { useError } from "../../../shared/hooks/useError"; 
import { RootStackParamList } from "../../../navigation/types"; // Твоят тип
import { Alert } from "react-native";

export const useCarDetails = () => {
    // 1. Взимаме ID-то от route params (React Navigation начин)
    const route = useRoute<RouteProp<RootStackParamList, 'CarDetails'>>();
    const { id } = route.params; 

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const carId = Number(id);

    const [car, setCar] = useState<CarDetails | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const { handleError } = useError();
    
    const isOwner = car !== null && user !== null && car.sellerId === user.id;

    // 2. Зареждане на данни
    useEffect(() => {
        if (!id || isNaN(carId)) {
            dispatch(setError("Invalid Car ID"));
            navigation.navigate("CarList");
            return;
        }

        const fetchCar = async () => {
            dispatch(setLoading(true));
            dispatch(clearError());
            try {
                const data = await getCarById(carId);
                setCar(data);
            } catch (error) {
                handleError(error);
                // В Native 3 секунди са много време, често се ползва по-бърз Feedback
                setTimeout(() => {
                    navigation.navigate("CarList");
                }, 2000);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchCar();
    }, [id, dispatch, carId, navigation, handleError]);

    // 3. Изтриване (Native начин с Alert.alert вместо window.confirm)
    const processDelete = async () => {
        dispatch(setLoading(true));
        dispatch(clearError());
        try {
            await deleteCar(carId);
            navigation.navigate("CarList");
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDelete = () => {
        if (!car) return;
        
        if (!isOwner) {
            Alert.alert("Permission Denied", "You are not the owner of this car.");
            return;
        }

        // Вместо window.confirm ползваме Alert
        Alert.alert(
            "Delete Car",
            "Are you sure you want to delete this car?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: processDelete }
            ]
        );
    };

    return { car, isOwner, handleDelete };
};
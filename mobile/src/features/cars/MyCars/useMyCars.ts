import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '@autovibe/app-state';
import { useCallback, useEffect, useState } from "react";
import { clearError, setCars, setError, setLoading } from '@autovibe/app-state';
import { deleteCar, getCarsByUserId } from "../../../api/carsService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";


export const useMyCars = () => {
    const { cars, loading, error } = useSelector((state: RootState) => state.cars);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [carIdToDelete, setCarIdToDelete] = useState<number | null>(null);

    const msg = (err: unknown) =>
        err && typeof err === "object" &&
            "message" in err ? String((err as
                { message: string }).message) : "Unable to load your cars.";

    const fetchCars = useCallback(async () => {
        if(!isAuthenticated || !user?.id){
            navigation.navigate("Login");
            return;
        }

        dispatch(setLoading(true));
        dispatch(clearError());
        
        try{
            const response = await getCarsByUserId(page, 9);
            const allCars = response.items ?? [];
            const myCars = allCars.filter((c) => c.userId === user.id);
            dispatch(setCars(myCars));
            setTotalPages(response.totalPages ?? 0); 
        }catch(err) {
            dispatch(setError(msg(err)));
        }finally{
            dispatch(setLoading(false));
        }
    }, [page, user?.id, isAuthenticated, navigation, dispatch])

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    const handleDeletePress = (id: number) => {
        setCarIdToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete: () => Promise<void> = async () => {
        if(carIdToDelete == null) return;
        dispatch(setLoading(true));
        dispatch(clearError());
        try{
            await deleteCar(carIdToDelete);
            dispatch(setCars(cars.filter((c) => c.id !== carIdToDelete)));
            setShowDeleteConfirm(false);
            setCarIdToDelete(null);
        }catch{
            dispatch(setError("Unable to delete this car."));
        }finally{
            dispatch(setLoading(false));
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setCarIdToDelete(null);
    };

    return {
        cars,
        loading,
        error,
        page,
        totalPages,
        setPage,
        showDeleteConfirm,
        handleDeletePress,
        handleConfirmDelete,
        handleCancelDelete,
    }
}
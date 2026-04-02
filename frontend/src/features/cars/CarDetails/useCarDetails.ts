import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, setError, setLoading } from "../../../stores/carsSlice";
import { deleteCar, getCarById, type CarDetails } from "../../../api/carsService";
import { useNavigate, useParams } from "react-router";
import type { RootState } from "../../../stores/store";
import { useError } from "../../../shared/CustomHooks/useError"; 


export const useCarDetails = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const carId = Number(id);

    const [car, setCar] = useState<CarDetails | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const {handleError} = useError();
    const isOwner = car !== null && user !== null && car.sellerId === user.id;
    
    const [, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!id || isNaN(carId)) {
            dispatch(setError("Invalid Car ID"));
            navigate("/cars");
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
                setTimeout(() => {
                    navigate("/cars");
                }, 3000)
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchCar();
    }, [id, dispatch, carId, navigate, handleError]);

   

    const handleDelete = async () => {
        if (!car){
            dispatch(setError("Car not found"));
            navigate("/cars");
            return;
        }
        if (!id || !window.confirm("Are you sure?")) return;
        if (car.sellerId !== user?.id) {
            dispatch(setError("You are not the owner of this car."));
            return;
        }
        if (!isOwner) {
            dispatch(setError("You don't have permission to delete this."));
            return;
        }
        dispatch(setLoading(true));
        dispatch(clearError());
        try {
            setShowDeleteConfirm(true);
            await deleteCar(carId);
            navigate("/cars");
        dispatch(setLoading(false));

        } catch (error) {
            handleError(error)
        dispatch(setLoading(false));

        }
    };

    return { car, isOwner, handleDelete }

} 
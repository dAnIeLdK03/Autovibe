import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { CarDetails } from "../../../../api/carsService";
import { useDispatch, useSelector } from "react-redux";
import { useError } from "../../../../shared/CustomHooks/useError";
import { clearError, setError, setLoading, type RootState } from "@autovibe/app-state";
import { getDeletedCarById, hardDeleteCarAdmin, restoreCarAdmin, UserRole } from "../../../../api/adminService";


export const useDeletedCarDetails = () => {
    const {id} = useParams<{id: string}>();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const carId = Number(id);

    const [car, setCar] = useState<CarDetails | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const {handleError} = useError();


    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!id || isNaN(carId)) {
            dispatch(setError("Invalid Car ID"));
            navigate("/cars");
            return;
        }

        const fetchCar = async () => {
            dispatch(setLoading(true));
            dispatch(clearError());
            try{
                const data = await getDeletedCarById(carId);
                setCar(data);
            }catch(error){
                handleError(error);
                const timer = setTimeout(() => {
                    navigate("/cars");
                }, 3000);
                return () => clearTimeout(timer);
            }finally{
                dispatch(setLoading(false));
            }
        };
        fetchCar();
    }, [id, dispatch, carId, navigate, handleError]);


    const handleDelete = () => {
        if(!car){
            dispatch(setError("Car not found."));
            navigate("/admin/deleted");
            return;
        }
        if(user?.role !== UserRole.Admin){
            dispatch(setError("You don't have permission to delete this."));
            return;
        }
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        dispatch(setLoading(true));
        dispatch(clearError());
        try{
            await hardDeleteCarAdmin(carId);
            navigate("/admin/deleted");
        }catch(error){
            handleError(error);
            setShowDeleteConfirm(false);
        }finally{
            dispatch(setLoading(false));
        }
    };

    const handleRestore = async () => {
         if(!car){
            dispatch(setError("Car not found."));
            navigate("/admin/deleted");
            return;
        }
        if(user?.role !== UserRole.Admin){
            dispatch(setError("You don't have permission to restore this."));
            return;
        }
            dispatch(setLoading(true));
            dispatch(clearError());
            try{
                await restoreCarAdmin(carId);
                navigate("/admin/deleted");
                dispatch(setLoading(false));
            }catch(error){
                handleError(error);
                dispatch(setLoading(false));
            }
    };

    return { car, handleDelete, handleConfirmDelete, handleRestore, showDeleteConfirm, setShowDeleteConfirm }
}
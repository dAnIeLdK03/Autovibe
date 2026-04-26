import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '@autovibe/app-state';
import { useNavigate } from "react-router";
import { clearError, setCars, setError, setLoading } from '@autovibe/app-state';
import { deleteCar, getCarsByUserId } from "../../../api/carsService";
import { useCallback, useEffect, useState } from "react";


export const useMyCars = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [carIdToDelete, setCarIdToDelete] = useState<number | null>(null);
    const { cars, loading, error } = useSelector((state: RootState) => state.cars);




    const msg = (err: unknown) =>
        err && typeof err === "object" &&
            "message" in err ? String((err as
                { message: string }).message) : "Unable to load your cars.";

    const fecthCars = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            navigate("/login");
            return;
        }

        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            const response = await getCarsByUserId(page, 9);
            const allCars = response.items ?? [];
            const myCars = allCars.filter((c) => c.userId === user.id);
            dispatch(setCars(myCars));
            setTotalPages(response.totalPages ?? 0);
        } catch (err) {
            dispatch(setError(msg(err)));
        } finally {
            dispatch(setLoading(false));
        }
    }, [page, user?.id, isAuthenticated, navigate, dispatch])

    useEffect(() => {
        fecthCars();
    }, [fecthCars])


    const handleDeleteClick = (id: number) => {
        setCarIdToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete: () => Promise<void> = async () => {
        if (carIdToDelete == null) return;
        dispatch(setLoading(true));
        dispatch(clearError());
        try {
            await deleteCar(carIdToDelete);
            dispatch(setCars(cars.filter((c) => c.id !== carIdToDelete)));
            setShowDeleteConfirm(false);
            setCarIdToDelete(null);
        } catch {
            dispatch(setError("Unable to delete car."));
        } finally {
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
        handleDeleteClick,
        handleConfirmDelete,
        handleCancelDelete,
    }
}
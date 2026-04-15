import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../../stores/store"
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { clearError, setCars, setError, setLoading } from "../../../../stores/carsSlice";
import { deleteFavorite, getFavoritesByUserId } from "../../../../api/favoriteService";


export const useMyFavorite = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [favoriteCarIdToDelete, setFavoriteCarIdToDelete] = useState<number | null>(null);
    const { cars, loading, error } = useSelector((state: RootState) => state.cars);


    const msg = (err: unknown) =>
        err && typeof err === "object" &&
            "message" in err ? String((err as
                { message: string }).message) : "Unable to load your cars.";

    const fetchCars = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            navigate("/login");
            return;
        }

        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            const response = await getFavoritesByUserId(page, 9);
            dispatch(setCars(response.items ?? []));
            setTotalPages(response.totalPages ?? 0);
        } catch (err) {
            dispatch(setError(msg(err)));
        } finally {
            dispatch(setLoading(false));
        }
    }, [page, user?.id, isAuthenticated, navigate, dispatch])

    useEffect(() => {
        fetchCars();
    }, [fetchCars])

    const handleDeleteClick = (id: number) => {
        setFavoriteCarIdToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete: () => Promise<void> = async () => {
            if (favoriteCarIdToDelete == null) return;
            dispatch(setLoading(true));
            dispatch(clearError());
            try {
                await deleteFavorite(favoriteCarIdToDelete);
                dispatch(setCars(cars.filter((c) => c.id !== favoriteCarIdToDelete)));
                setShowDeleteConfirm(false);
                setFavoriteCarIdToDelete(null);
            } catch {
                dispatch(setError("Unable to delete car."));
            } finally {
                dispatch(setLoading(false));
            }
        };
        const handleCancelDelete = () => {
            setShowDeleteConfirm(false);
            setFavoriteCarIdToDelete(null);
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
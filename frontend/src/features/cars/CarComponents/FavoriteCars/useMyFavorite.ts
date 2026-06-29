import { useDispatch, useSelector } from "react-redux"
import type { RootState } from '@autovibe/app-state'
import { useCallback, useEffect, useState } from "react";
import { clearError, setCars, setError, setLoading } from '@autovibe/app-state';
import { deleteFavorite, getFavoritesByUserId } from "../../../../api/favoriteService";
import { extractApiErrorMessage } from "../../../../shared/extractErrorMessage/extractApiErrorMessage";


export const useMyFavorite = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [favoriteCarIdToDelete, setFavoriteCarIdToDelete] = useState<number | null>(null);
    const { cars, loading, error } = useSelector((state: RootState) => state.cars);
    const controller = new AbortController();

    const fetchCars = useCallback(async () => {
        const { signal } = controller;
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            const response = await getFavoritesByUserId(page, 9);
            dispatch(setCars(response.items ?? []));
            setTotalPages(response.totalPages ?? 0);
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return;
            dispatch(setError(extractApiErrorMessage(err)));
        } finally {
            if (!signal.aborted) {
                dispatch(setLoading(false));
            }
        }
    }, [page, isAuthenticated, dispatch])

    useEffect(() => {
        fetchCars();

        return () => {
            controller.abort();
        }
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
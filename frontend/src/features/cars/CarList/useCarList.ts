import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCars, type CarFilters } from '../../../api/carsService';
import { clearError, setCars, setError, setLoading } from '@autovibe/app-state';
import type { RootState } from '@autovibe/app-state';

export const useCarList = (initialFilters: CarFilters) => {
    const dispatch = useDispatch();
    const { cars, loading, error } = useSelector((state: RootState) => state.cars);

    const [filters, setFilters] = useState<CarFilters>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<CarFilters>(initialFilters);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const controller = new AbortController();

    const fetchCars = useCallback(async () => {
        const { signal } = controller;
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            const queryParams = {
                ...appliedFilters,
                sortType: filters.sortType
            };

            if (!queryParams.power || queryParams.power === "0") {
                delete queryParams.power;
            }

            const response = await getCars(page, 18, queryParams);
            dispatch(setCars(response.items ?? []));
            setTotalPages(response.totalPages ?? 0);
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;
            dispatch(setError("Unable to load cars. Please try again."));
            dispatch(setCars([]));
            setTotalPages(0);
        } finally {
            if (!signal.aborted) {
                dispatch(setLoading(false));
            }
        }
    }, [appliedFilters, filters.sortType, page, dispatch]);

    useEffect(() => {
        const controller = new AbortController();
        fetchCars();
        return () => controller.abort();
    }, [fetchCars]);

    const handleApplyFilters = (finalFilters: CarFilters) => {
        setFilters(finalFilters);
        setAppliedFilters(finalFilters);
        setPage(1);
    };

    const handleUpdateSort = (key: keyof CarFilters, value: CarFilters[keyof CarFilters]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return {
        cars, loading, error,
        filters, page, totalPages,
        handleApplyFilters,
        handleUpdateSort,
        handleReset,
        handlePageChange
    };
};
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCars, type CarFilters } from '../../../api/carsService';
import { clearError, setCars, setLoading } from '../../../stores/carsSlice';
import type { RootState } from '../../../stores/store';

export const useCarList = (initialFilters: CarFilters) => {
    const dispatch = useDispatch();
    const { cars, loading, error } = useSelector((state: RootState) => state.cars);

    const [filters, setFilters] = useState<CarFilters>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<CarFilters>(initialFilters);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchCars = useCallback(async () => {
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
        } catch {
            dispatch(setCars([]));
            setTotalPages(0);
        } finally {
            dispatch(setLoading(false));
        }
    }, [appliedFilters, filters.sortType, page, dispatch]);

    useEffect(() => {
        fetchCars();
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
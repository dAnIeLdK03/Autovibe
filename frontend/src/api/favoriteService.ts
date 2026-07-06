import { api } from "./api";
import type { CarsPageResponse } from "./carsService";

export const addFavorite = async (carId: number): Promise<void> => {
    await api.post(`/favorites/${carId}`);
}

export const deleteFavorite = async (carId: number): Promise<void> => {
    await api.delete(`/favorites/${carId}`);
}

export const getFavoritesByUserId = async (page: number, pageSize: number, signal?: AbortSignal): Promise<CarsPageResponse> => {
    const params = new URLSearchParams();
    params.append('pageNumber', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await api.get(`/favorites?${params.toString()}`, { signal });
    return response.data;
}

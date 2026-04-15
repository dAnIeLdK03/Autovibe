import { api } from "./api";
import type { CarsPageResponse } from "./carsService";

export const addFavorite = async (carId: Number): Promise<void> => {
    const response = await api.post(`/favorites/${carId}`);
    return response.data;
}

export const deleteFavorite = async (carId: Number): Promise<void> => {
    await api.delete(`/favorites/${carId}`);
}

export const getFavoritesByUserId = async (page: number, pageSize: number): Promise<CarsPageResponse> => {
    const params = new URLSearchParams();
    params.append('pageNumber', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await api.get(`/favorites?${params.toString()}`);
    return response.data;
}

export const isfavorite = async(carId: Number): Promise<void> => {
    const response = await api.get(`/favorites/contains/${carId}`);
    return response.data;
}
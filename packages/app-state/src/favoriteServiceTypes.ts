import type { Car } from './slices/carsSlice';

export interface CarsPageResponse {
  items: Car[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export type FavoriteService = {
  addFavorite: (carId: number) => Promise<void>;
  deleteFavorite: (carId: number) => Promise<void>;
  getFavoritesByUserId: (page: number, pageSize: number) => Promise<CarsPageResponse>;
};

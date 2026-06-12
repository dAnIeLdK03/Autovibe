import type { AuthState } from './slices/authSlice'
import type { CarState } from './slices/carsSlice'
import type { FavoritesState } from './slices/favoritesSlice'
import type { AdminUsersState } from './slices/adminUsersSlice'

export type RootState = {
  auth: AuthState
  cars: CarState
  favorites: FavoritesState
  adminUsers: AdminUsersState
}

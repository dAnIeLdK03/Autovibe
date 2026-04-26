import { createAutovibeStore, type AppDispatch, type RootState } from '@autovibe/app-state'
import { addFavorite, deleteFavorite, getFavoritesByUserId } from '../api/favoriteService'

export const store = createAutovibeStore({
  addFavorite,
  deleteFavorite,
  getFavoritesByUserId,
})

export type { RootState, AppDispatch }
